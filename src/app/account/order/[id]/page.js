"use client"
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { getOrderByOrderId, addToCart, requestReturn, requestReplacement, cancelOrderByUser } from '@/api/auth';
import { FiArrowLeft, FiHelpCircle, FiShoppingBag, FiTruck, FiMapPin, FiInfo } from 'react-icons/fi';

export default function OrderDetailsPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestType, setRequestType] = useState(null); // 'cancel', 'return', 'replacement'
    const [requestReason, setRequestReason] = useState('');
    const [selectedReason, setSelectedReason] = useState('');

    const cancellationReasons = [
        "Changed my mind",
        "Found a better price elsewhere",
        "Ordered by mistake",
        "Delivery taking too long",
        "Other"
    ];

    const helpReasons = [
        "Product is damaged / defective",
        "Wrong item received",
        "Size or Fit issue",
        "Quality not as expected",
        "Item arrived late",
        "Other"
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderByOrderId(id);
                // response is already unwrapped in auth.ts (returns response.data?.data || response.data)
                // If the backend returns { status, data: { data: order } }, auth.ts returns { data: order }
                // So we may need one more unwrap here if response.data exists
                const orderData = response?.data && !Array.isArray(response.data) ? response.data : response;
                setOrder(orderData);
            } catch (err) {
                console.error('Failed to fetch order details', err);
                toast.error('Failed to load order details');
                router.push('/account?tab=realm');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, router]);

    const handleSubmitRequest = async (e) => {
        if (e) e.preventDefault();
        if (!selectedReason) {
            toast.warn('Please select a reason');
            return;
        }
        if (selectedReason === 'Other' && !requestReason.trim()) {
            toast.warn('Please provide more details for "Other" reason');
            return;
        }

        setRequestLoading(true);
        try {
            const finalReason = selectedReason === 'Other' ? requestReason : `${selectedReason}${requestReason ? ': ' + requestReason : ''}`;

            let response;
            if (requestType === 'cancel') {
                response = await cancelOrderByUser(id, finalReason);
            } else if (requestType === 'return') {
                response = await requestReturn(id, finalReason);
            } else if (requestType === 'replacement') {
                response = await requestReplacement(id, finalReason);
            }
            
            toast.success(`${requestType.charAt(0).toUpperCase() + requestType.slice(1)} request submitted successfully`);
            setRequestType(null);
            setRequestReason('');
            setSelectedReason('');
            setShowHelpModal(false);
            // Refresh order data
            const updated = await getOrderByOrderId(id);
            setOrder(updated.data || updated);
        } catch (err) {
            console.error('Request error:', err);
            // Handle different error structures from backend
            const errorMsg = 
                err?.error?.message || 
                err?.message || 
                (typeof err === 'string' ? err : `Error submitting ${requestType} request`);
                
            toast.error(errorMsg);
        } finally {
            setRequestLoading(false);
        }
    };

    const handleBuyAgain = async () => {
        try {
            for (const item of order.products) {
                const productId = item.product?._id || item.product;
                const variantId = item.variant?._id || item.variant || "";
                await addToCart(productId, variantId, item.quantity);
            }
            toast.success('Items added to cart');
            router.push('/checkout');
        } catch (err) {
            toast.error('Failed to add items to cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BA7E38] border-r-transparent"></div>
            </div>
        );
    }

    if (!order) return null;

    const hoursElapsed = (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt);
    const daysElapsed = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
    
    const canCancel = order.order_status === 'PLACED';
    const canReturn = order.order_status === 'DELIVERED' && daysElapsed <= 7 && !order.return_request && !order.replacement_request;
    const canReplace = order.order_status === 'DELIVERED' && daysElapsed <= 7 && !order.return_request && !order.replacement_request;
    const canBuyAgain = ['DELIVERED', 'CANCELLED_BY_USER', 'CANCELLED_BY_ADMIN', 'RETURNED'].includes(order.order_status);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-avenir-400">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => router.push('/account?tab=realm')}
                    className="flex items-center text-[#BA7E38] font-medium mb-8 hover:underline"
                >
                    <FiArrowLeft className="mr-2" /> Back to Account
                </button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Page Header */}
                    <div className="px-6 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#4C0A2E]">Order Details</h1>
                            <p className="text-sm text-gray-500 mt-1">Order ID: #{order._id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider">
                                {order.order_status?.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Active Requests Alert on main page */}
                    {!order.order_status?.includes('CANCELLED') && order.order_status !== 'PLACED' && order.order_status !== 'SHIPPED' && (order.return_request || order.replacement_request) && (
                        <div className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                            <FiInfo className="text-blue-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-blue-900">Active Request Found</h4>
                                <div className="mt-2 space-y-3">
                                    {order.return_request && (
                                        <div className="text-xs">
                                            <p className="font-bold text-blue-700">Return - {order.return_request.status}</p>
                                            <p className="text-blue-600/80 mt-1">{order.return_request.reason}</p>
                                            {order.return_request.admin_comment && (
                                                <p className="mt-2 p-2 bg-white/50 rounded border border-blue-100 italic">
                                                    <span className="font-bold not-italic">Support Team:</span> {order.return_request.admin_comment}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {order.replacement_request && (
                                        <div className="text-xs">
                                            <p className="font-bold text-blue-700">Replacement - {order.replacement_request.status}</p>
                                            <p className="text-blue-600/80 mt-1">{order.replacement_request.reason}</p>
                                            {order.replacement_request.admin_comment && (
                                                <p className="mt-2 p-2 bg-white/50 rounded border border-blue-100 italic">
                                                    <span className="font-bold not-italic">Support Team:</span> {order.replacement_request.admin_comment}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cancellation Info (if any) */}
                    {order.order_status?.includes('CANCELLED') && order.cancellation && (
                        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <span className="text-red-600 mt-1 text-xl">&times;</span>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-red-900">Order Cancelled</h4>
                                <p className="text-xs text-red-700 mt-1">{order.cancellation.reason}</p>
                            </div>
                        </div>
                    )}

                    <div className="p-6 space-y-8">
                        {/* Products List */}
                        <section>
                            <h2 className="text-lg font-bold text-[#4C0A2E] mb-4 flex items-center">
                                <FiShoppingBag className="mr-2" /> Items
                            </h2>
                            <div className="space-y-4">
                                {order.products?.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image 
                                                src={item.product?.productImageUrl?.[0] || '/images/home/img3.jpg'} 
                                                alt={item.product?.productTitle || 'Product Image'} 
                                                fill
                                                className="object-cover rounded-lg shadow-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[#4C0A2E]">{item.product?.productTitle}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Quantity: {item.quantity} | ₹{item.price || item.product?.salePrice}
                                            </p>
                                            {item.variant && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Variant: {item.variant.name || 'Default'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#BA7E38]">₹{(item.price || item.product?.salePrice) * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Shipping & Payment Info */}
                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-lg font-bold text-[#4C0A2E] mb-4 flex items-center">
                                        <FiMapPin className="mr-2" /> Shipping Address
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-xl text-sm leading-relaxed text-gray-700">
                                        <p className="font-bold text-gray-900">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                        <p>{order.shippingAddress?.street}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                                        <p>{order.shippingAddress?.country}</p>
                                        <p className="mt-3 flex items-center font-medium text-[#BA7E38]">
                                            Phone: {order.shippingAddress?.phoneNumber}
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-lg font-bold text-[#4C0A2E] mb-4 flex items-center">
                                        <FiTruck className="mr-2" /> Delivery Status
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-xl text-sm">
                                        <p className="text-gray-600">Current Status</p>
                                        <p className="font-bold text-[#BA7E38] text-base uppercase mt-1">
                                            {order.order_status?.replace(/_/g, ' ')}
                                        </p>
                                        {order.deliveredAt && (
                                            <p className="text-gray-500 mt-1">
                                                Delivered on: {new Date(order.deliveredAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Order Summary Calculations */}
                            <section>
                                <h2 className="text-lg font-bold text-[#4C0A2E] mb-4 flex items-center">
                                    <FiInfo className="mr-2" /> Summary
                                </h2>
                                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{order.orderTotal || 0}.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">FREE</span>
                                    </div>
                                    {order.coupon_discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Coupon Discount</span>
                                            <span>- ₹{order.coupon_discount}.00</span>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center font-bold text-xl text-[#4C0A2E]">
                                        <span>Total</span>
                                        <span className="text-[#BA7E38]">₹{order.order_price || order.total_amount_paid || order.orderTotal || 0}.00</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex flex-col gap-3">
                                    {canBuyAgain && (
                                        <button 
                                            onClick={handleBuyAgain}
                                            className="w-full py-3 bg-[#BA7E38] text-white rounded-xl font-bold shadow-md shadow-[#BA7E38]/20 hover:bg-[#a96f2e] transition transform active:scale-95"
                                        >
                                            Buy Again
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setShowHelpModal(true)}
                                        className="w-full py-3 border-2 border-[#BA7E38] text-[#BA7E38] rounded-xl font-bold hover:bg-orange-50 transition flex items-center justify-center gap-2"
                                    >
                                        <FiHelpCircle /> Need Help?
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-[#4C0A2E]">
                                    {requestType ? `${requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request` : 'Help & Support'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {requestType ? 'Please provide additional details' : 'Select an option for your order'}
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    if (requestType) {
                                        setRequestType(null);
                                    } else {
                                        setShowHelpModal(false);
                                    }
                                }} 
                                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                            >
                                {requestType ? <FiArrowLeft className="text-xl" /> : <span className="text-2xl">&times;</span>}
                            </button>
                        </div>

                        {!requestType ? (
                            <div className="space-y-4">
                                {/* Active Requests View */}
                                {!order.order_status?.includes('CANCELLED') && order.order_status !== 'PLACED' && order.order_status !== 'SHIPPED' && (order.return_request || order.replacement_request) && (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                                        <h4 className="text-sm font-bold text-[#4C0A2E] mb-3 flex items-center">
                                            <FiInfo className="mr-2 text-blue-600" /> Active Requests
                                        </h4>
                                        <div className="space-y-4">
                                            {order.return_request && (
                                                <div className="text-xs bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-bold text-blue-700">Return Request</p>
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md font-bold uppercase">{order.return_request.status}</span>
                                                    </div>
                                                    {order.return_request.reason && <p className="text-gray-600 mt-1"><span className="font-medium">Reason:</span> {order.return_request.reason}</p>}
                                                    {order.return_request.admin_comment && (
                                                        <p className="text-red-600 mt-2 p-2 bg-white rounded border border-red-50 italic">
                                                            <span className="font-bold not-italic">Support Team:</span> {order.return_request.admin_comment}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            {order.replacement_request && (
                                                <div className="text-xs bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-bold text-purple-700">Replacement Request</p>
                                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-bold uppercase">{order.replacement_request.status}</span>
                                                    </div>
                                                    {order.replacement_request.reason && <p className="text-gray-600 mt-1"><span className="font-medium">Reason:</span> {order.replacement_request.reason}</p>}
                                                    {order.replacement_request.admin_comment && (
                                                        <p className="text-red-600 mt-2 p-2 bg-white rounded border border-red-50 italic">
                                                            <span className="font-bold not-italic">Support Team:</span> {order.replacement_request.admin_comment}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {canCancel && (
                                    <button 
                                        onClick={() => setRequestType('cancel')}
                                        className="w-full p-4 text-left rounded-xl border-2 border-red-50 hover:bg-red-50 hover:border-red-200 transition-all group flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <span className="text-xl font-bold">&times;</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-600">Cancel Order</p>
                                            <p className="text-xs text-red-400 mt-0.5">Cancel before processing</p>
                                        </div>
                                    </button>
                                )}

                                {canReturn ? (
                                    <button 
                                        onClick={() => setRequestType('return')}
                                        className="w-full p-4 text-left rounded-xl border-2 border-blue-50 hover:bg-blue-50 hover:border-blue-200 transition-all group flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <FiArrowLeft className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-blue-600">Return Order</p>
                                            <p className="text-xs text-blue-400 mt-0.5">Return items within 7 days of delivery</p>
                                        </div>
                                    </button>
                                ) : (
                                    order.order_status === 'SHIPPED' && (
                                        <p className="text-sm text-gray-400 p-4 border rounded-xl bg-gray-50 italic text-center">Return & Replacement options available after delivery</p>
                                    )
                                )}

                                {canReplace && (
                                    <button 
                                        onClick={() => setRequestType('replacement')}
                                        className="w-full p-4 text-left rounded-xl border-2 border-purple-50 hover:bg-purple-50 hover:border-purple-200 transition-all group flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <FiShoppingBag className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-purple-600">Replacement Order</p>
                                            <p className="text-xs text-purple-400 mt-0.5">Exchange for a fresh item (within 7 days)</p>
                                        </div>
                                    </button>
                                )}

                                {!canCancel && !canReturn && !canReplace && (
                                    <div className="p-4 bg-[#4C0A2E]/5 rounded-xl border border-[#4C0A2E]/10">
                                        <p className="text-sm text-[#4C0A2E]">For further assistance, please contact our support at <span className="font-bold">support@raajsi.com</span> or call us.</p>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setShowHelpModal(false)}
                                    className="w-full mt-2 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitRequest} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Why do you want to {requestType}?
                                    </label>
                                    <select
                                        required
                                        value={selectedReason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA7E38] focus:border-transparent outline-none transition bg-white text-sm"
                                    >
                                        <option value="">Select a reason</option>
                                        {(requestType === 'cancel' ? cancellationReasons : helpReasons).map((r, idx) => (
                                            <option key={idx} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedReason && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Additional Comments {selectedReason !== 'Other' && '(Optional)'}
                                        </label>
                                        <textarea
                                            required={selectedReason === 'Other'}
                                            value={requestReason}
                                            onChange={(e) => setRequestReason(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA7E38] focus:border-transparent outline-none transition text-sm"
                                            rows="4"
                                            placeholder={selectedReason === 'Other' ? "Please specify your reason..." : "Any more details you'd like to share?"}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setRequestType(null);
                                            setSelectedReason('');
                                            setRequestReason('');
                                        }}
                                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={requestLoading || !selectedReason}
                                        className="flex-1 py-3 bg-[#BA7E38] text-white rounded-xl font-bold shadow-md shadow-[#BA7E38]/20 hover:bg-[#a96f2e] transition disabled:opacity-50"
                                    >
                                        {requestLoading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
