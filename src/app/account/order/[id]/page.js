"use client"
import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { getOrderByOrderId, addToCart, requestReturn, requestReplacement, cancelOrderByUser } from '@/api/auth';
import { FiArrowLeft, FiHelpCircle, FiShoppingBag, FiTruck, FiMapPin, FiInfo, FiUpload, FiX } from 'react-icons/fi';

export default function OrderDetailsPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const featuredProductId = searchParams.get('productId');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestType, setRequestType] = useState(null); // 'cancel', 'return', 'replacement'
    const [requestReason, setRequestReason] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [proofImages, setProofImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

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
                // If the backend returns { status, data: { data: order, replacementOrder } }, auth.ts returns { data: order, replacementOrder }
                // So we may need one more unwrap here if response.data exists
                const inner = response?.data && !Array.isArray(response.data) ? response.data : response;
                const orderData = inner?.data && !Array.isArray(inner.data) ? inner.data : inner;
                // Attach replacementOrder if present
                if (inner?.replacementOrder) {
                    orderData._replacementOrder = inner.replacementOrder;
                }
                setOrder(orderData);
            } catch (err) {
                console.error('Failed to fetch order details', err);
                toast.error('Failed to load order details');
                router.push('/account?tab=realm');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchOrder();

        // Auto-refresh every 10 seconds
        const intervalId = setInterval(() => {
            fetchOrder();
        }, 10000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [id, router]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            toast.error('Please upload only JPG, PNG, or WEBP images');
            return;
        }

        // Validate file sizes (max 5MB each)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Each image must be less than 5MB');
            return;
        }

        // Limit to 5 images total
        if (proofImages.length + files.length > 5) {
            toast.error('You can upload a maximum of 5 images');
            return;
        }

        setUploadingImages(true);
        try {
            // Convert files to base64 for preview and storage
            const imagePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const imageDataUrls = await Promise.all(imagePromises);
            setProofImages(prev => [...prev, ...imageDataUrls]);
            toast.success(`${files.length} image(s) added`);
        } catch (err) {
            console.error('Image upload error:', err);
            toast.error('Failed to process images');
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index) => {
        setProofImages(prev => prev.filter((_, i) => i !== index));
    };

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

        // Validate image upload for return/replacement requests
        if ((requestType === 'return' || requestType === 'replacement') && proofImages.length === 0) {
            toast.warn('Please upload at least one product photo');
            return;
        }

        setRequestLoading(true);
        try {
            const finalReason = selectedReason === 'Other' ? requestReason : `${selectedReason}${requestReason ? ': ' + requestReason : ''}`;

            // Get featured item details for item-level requests
            const productId = featuredItem?.product?._id || featuredItem?.product;
            const variantId = featuredItem?.variant?._id || featuredItem?.variant || null;
            const quantity = featuredItem?.quantity || 1;

            let response;
            if (requestType === 'cancel') {
                // Item-level cancellation
                response = await cancelOrderByUser(id, finalReason, productId, variantId, quantity);
            } else if (requestType === 'return') {
                // Item-level return request
                response = await requestReturn(id, finalReason, proofImages, productId, variantId, quantity);
            } else if (requestType === 'replacement') {
                // Item-level replacement request
                response = await requestReplacement(id, finalReason, proofImages, productId, variantId, quantity);
            }

            toast.success(`${requestType.charAt(0).toUpperCase() + requestType.slice(1)} request submitted successfully`);
            setRequestType(null);
            setRequestReason('');
            setSelectedReason('');
            setProofImages([]);
            setShowHelpModal(false);

            // Immediately refresh order data after successful request
            try {
                const updated = await getOrderByOrderId(id);
                const updatedInner = updated?.data && !Array.isArray(updated.data) ? updated.data : updated;
                const updatedOrderData = updatedInner?.data && !Array.isArray(updatedInner.data) ? updatedInner.data : updatedInner;
                if (updatedInner?.replacementOrder) {
                    updatedOrderData._replacementOrder = updatedInner.replacementOrder;
                }
                setOrder(updatedOrderData);
            } catch (refreshErr) {
                console.error('Failed to refresh order after request:', refreshErr);
                // Don't show error to user as the request was successful
            }
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
            // Add only the featured item to cart
            const productId = featuredItem.product?._id || featuredItem.product;
            const variantId = featuredItem.variant?._id || featuredItem.variant || "";
            await addToCart(productId, variantId, featuredItem.quantity);
            toast.success('Item added to cart');
            router.push('/checkout');
        } catch (err) {
            toast.error('Failed to add item to cart');
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

    // Split products into featured and other items
    const featuredItem = featuredProductId
        ? order.products?.find(p => (p.product?._id || p.product) === featuredProductId)
        : order.products?.[0]; // Default to first item if no productId specified

    const otherItems = featuredProductId
        ? order.products?.filter(p => (p.product?._id || p.product) !== featuredProductId) || []
        : order.products?.slice(1) || []; // If no productId, show rest as other items

    const hoursElapsed = (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt);
    const daysElapsed = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);

    // Check if featured item has existing return/replacement request or is cancelled
    const featuredProductIdStr = featuredItem?.product?._id || featuredItem?.product;
    const featuredVariantIdStr = featuredItem?.variant?._id || featuredItem?.variant || null;

    // Check if this specific item is cancelled
    const isFeaturedItemCancelled = order.cancelled_items?.some(
        c => c.product.toString() === featuredProductIdStr &&
             (featuredVariantIdStr ? c.variant?.toString() === featuredVariantIdStr : !c.variant)
    );

    const hasFeaturedItemReturnRequest = order.item_return_requests?.some(
        r => r.product.toString() === featuredProductIdStr && r.status === 'PENDING'
    );
    const hasFeaturedItemReplacementRequest = order.item_replacement_requests?.some(
        r => r.product.toString() === featuredProductIdStr && r.status === 'PENDING'
    );

    // Compute the per-item status for the featured item
    const featuredItemReturnReq = order.item_return_requests?.find(
        r => r.product.toString() === featuredProductIdStr
    );
    const featuredItemReplacementReq = order.item_replacement_requests?.find(
        r => r.product.toString() === featuredProductIdStr
    );

    let featuredItemStatus;
    if (isFeaturedItemCancelled) {
        featuredItemStatus = 'CANCELLED';
    } else if (featuredItemReturnReq) {
        const statusMap = { PENDING: 'RETURN_REQUESTED', APPROVED: 'RETURN_APPROVED', REJECTED: 'RETURN_REJECTED' };
        featuredItemStatus = statusMap[featuredItemReturnReq.status] || order.order_status;
    } else if (featuredItemReplacementReq) {
        const statusMap = { PENDING: 'REPLACEMENT_REQUESTED', APPROVED: 'REPLACEMENT_APPROVED', REJECTED: 'REPLACEMENT_REJECTED' };
        featuredItemStatus = statusMap[featuredItemReplacementReq.status] || order.order_status;
    } else if (
        (order.item_return_requests?.length > 0 || order.item_replacement_requests?.length > 0) &&
        ['RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'REPLACEMENT_REQUESTED', 'REPLACEMENT_APPROVED', 'REPLACEMENT_REJECTED'].includes(order.order_status)
    ) {
        // Order status changed due to another item's request - this item is still DELIVERED
        featuredItemStatus = 'DELIVERED';
    } else {
        featuredItemStatus = order.order_status === 'CANCELLED_BY_USER' || order.order_status === 'CANCELLED_BY_ADMIN'
            ? 'CANCELLED'
            : order.order_status?.replace(/_/g, ' ');
    }

    // Allow returns/replacements when the order was delivered (or status shifted due to another item's request)
    const wasDelivered = order.order_status === 'DELIVERED' ||
        ['RETURN_REQUESTED', 'REPLACEMENT_REQUESTED'].includes(order.order_status);

    const canCancel = !isFeaturedItemCancelled && order.order_status === 'PLACED' && hoursElapsed <= 48;
    const canReturn = !isFeaturedItemCancelled && wasDelivered && daysElapsed <= 7 && !hasFeaturedItemReturnRequest && !hasFeaturedItemReplacementRequest && !order.return_request && !order.replacement_request;
    const canReplace = !isFeaturedItemCancelled && wasDelivered && daysElapsed <= 7 && !hasFeaturedItemReturnRequest && !hasFeaturedItemReplacementRequest && !order.return_request && !order.replacement_request;
    const canBuyAgain = isFeaturedItemCancelled || ['DELIVERED', 'CANCELLED_BY_USER', 'CANCELLED_BY_ADMIN', 'RETURNED'].includes(order.order_status);

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
                            {order.parent_order && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                                    Replacement
                                </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isFeaturedItemCancelled || featuredItemStatus === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : featuredItemStatus?.includes('RETURN') || featuredItemStatus?.includes('REPLACEMENT')
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}>
                                {featuredItemStatus?.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Replacement Order Banner - when viewing OLD order that has been replaced */}
                    {order.order_status === 'REPLACEMENT_APPROVED' && order._replacementOrder && (
                        <div className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                            <FiInfo className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-blue-900">Replacement Order Created</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Your replacement has been approved and a new order has been created.
                                    Track your replacement order for the latest status updates.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/account/order/${order._replacementOrder._id}`)}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                            >
                                View Replacement Order
                            </button>
                        </div>
                    )}

                    {/* Parent Order Link - when viewing a REPLACEMENT (child) order */}
                    {order.parent_order && (
                        <div className="mx-6 mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
                            <FiInfo className="text-purple-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-purple-900">This is a Replacement Order</h4>
                                <p className="text-xs text-purple-700 mt-1">
                                    This order was created as a replacement for your original order.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/account/order/${order.parent_order._id || order.parent_order}`)}
                                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition whitespace-nowrap"
                            >
                                View Original Order
                            </button>
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


                    {/* Item-Level Return/Replacement Requests for Featured Item */}
                    {featuredItem && featuredProductId && (order.item_return_requests?.length > 0 || order.item_replacement_requests?.length > 0) && (
                        <div className="mx-6 mt-6 space-y-3">
                            {/* Find return request for featured item */}
                            {(() => {
                                const itemReturn = order.item_return_requests?.find(
                                    r => r.product.toString() === (featuredItem.product?._id || featuredItem.product)
                                );
                                if (!itemReturn) return null;
                                return (
                                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                        itemReturn.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
                                        itemReturn.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                                        'bg-red-50 border-red-200'
                                    }`}>
                                        <FiInfo className={`mt-1 flex-shrink-0 ${
                                            itemReturn.status === 'PENDING' ? 'text-yellow-600' :
                                            itemReturn.status === 'APPROVED' ? 'text-green-600' :
                                            'text-red-600'
                                        }`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-sm font-bold ${
                                                    itemReturn.status === 'PENDING' ? 'text-yellow-900' :
                                                    itemReturn.status === 'APPROVED' ? 'text-green-900' :
                                                    'text-red-900'
                                                }`}>Return Request for This Item</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                    itemReturn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    itemReturn.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>{itemReturn.status}</span>
                                            </div>
                                            {itemReturn.reason && <p className={`text-xs mt-1 ${
                                                itemReturn.status === 'PENDING' ? 'text-yellow-700' :
                                                itemReturn.status === 'APPROVED' ? 'text-green-700' :
                                                'text-red-700'
                                            }`}><span className="font-medium">Reason:</span> {itemReturn.reason}</p>}
                                            {itemReturn.admin_comment && (
                                                <p className={`text-xs mt-2 p-2 rounded border italic ${
                                                    itemReturn.status === 'PENDING' ? 'bg-white/50 border-yellow-100' :
                                                    itemReturn.status === 'APPROVED' ? 'bg-white/50 border-green-100' :
                                                    'bg-white/50 border-red-100'
                                                }`}>
                                                    <span className="font-bold not-italic">Support Team:</span> {itemReturn.admin_comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Find replacement request for featured item */}
                            {(() => {
                                const itemReplacement = order.item_replacement_requests?.find(
                                    r => r.product.toString() === (featuredItem.product?._id || featuredItem.product)
                                );
                                if (!itemReplacement) return null;
                                return (
                                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                        itemReplacement.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
                                        itemReplacement.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                                        'bg-red-50 border-red-200'
                                    }`}>
                                        <FiInfo className={`mt-1 flex-shrink-0 ${
                                            itemReplacement.status === 'PENDING' ? 'text-yellow-600' :
                                            itemReplacement.status === 'APPROVED' ? 'text-green-600' :
                                            'text-red-600'
                                        }`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-sm font-bold ${
                                                    itemReplacement.status === 'PENDING' ? 'text-yellow-900' :
                                                    itemReplacement.status === 'APPROVED' ? 'text-green-900' :
                                                    'text-red-900'
                                                }`}>Replacement Request for This Item</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                    itemReplacement.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    itemReplacement.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>{itemReplacement.status}</span>
                                            </div>
                                            {itemReplacement.reason && <p className={`text-xs mt-1 ${
                                                itemReplacement.status === 'PENDING' ? 'text-yellow-700' :
                                                itemReplacement.status === 'APPROVED' ? 'text-green-700' :
                                                'text-red-700'
                                            }`}><span className="font-medium">Reason:</span> {itemReplacement.reason}</p>}
                                            {itemReplacement.admin_comment && (
                                                <p className={`text-xs mt-2 p-2 rounded border italic ${
                                                    itemReplacement.status === 'PENDING' ? 'bg-white/50 border-yellow-100' :
                                                    itemReplacement.status === 'APPROVED' ? 'bg-white/50 border-green-100' :
                                                    'bg-white/50 border-red-100'
                                                }`}>
                                                    <span className="font-bold not-italic">Support Team:</span> {itemReplacement.admin_comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Order-Level Return/Replacement Request Status (Legacy) */}
                    {(order.return_request || order.replacement_request) && (
                        <div className="mx-6 mt-6 space-y-3">
                            {order.return_request && (
                                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                    order.return_request.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
                                    order.return_request.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                                    'bg-red-50 border-red-200'
                                }`}>
                                    <FiInfo className={`mt-1 flex-shrink-0 ${
                                        order.return_request.status === 'PENDING' ? 'text-yellow-600' :
                                        order.return_request.status === 'APPROVED' ? 'text-green-600' :
                                        'text-red-600'
                                    }`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-sm font-bold ${
                                                order.return_request.status === 'PENDING' ? 'text-yellow-900' :
                                                order.return_request.status === 'APPROVED' ? 'text-green-900' :
                                                'text-red-900'
                                            }`}>Return Request</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                order.return_request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                order.return_request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>{order.return_request.status}</span>
                                        </div>
                                        {order.return_request.reason && <p className={`text-xs mt-1 ${
                                            order.return_request.status === 'PENDING' ? 'text-yellow-700' :
                                            order.return_request.status === 'APPROVED' ? 'text-green-700' :
                                            'text-red-700'
                                        }`}><span className="font-medium">Reason:</span> {order.return_request.reason}</p>}
                                        {order.return_request.admin_comment && (
                                            <p className={`text-xs mt-2 p-2 rounded border italic ${
                                                order.return_request.status === 'PENDING' ? 'bg-white/50 border-yellow-100' :
                                                order.return_request.status === 'APPROVED' ? 'bg-white/50 border-green-100' :
                                                'bg-white/50 border-red-100'
                                            }`}>
                                                <span className="font-bold not-italic">Support Team:</span> {order.return_request.admin_comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {order.replacement_request && (
                                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                    order.replacement_request.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
                                    order.replacement_request.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                                    'bg-red-50 border-red-200'
                                }`}>
                                    <FiInfo className={`mt-1 flex-shrink-0 ${
                                        order.replacement_request.status === 'PENDING' ? 'text-yellow-600' :
                                        order.replacement_request.status === 'APPROVED' ? 'text-green-600' :
                                        'text-red-600'
                                    }`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-sm font-bold ${
                                                order.replacement_request.status === 'PENDING' ? 'text-yellow-900' :
                                                order.replacement_request.status === 'APPROVED' ? 'text-green-900' :
                                                'text-red-900'
                                            }`}>Replacement Request</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                order.replacement_request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                order.replacement_request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>{order.replacement_request.status}</span>
                                        </div>
                                        {order.replacement_request.reason && <p className={`text-xs mt-1 ${
                                            order.replacement_request.status === 'PENDING' ? 'text-yellow-700' :
                                            order.replacement_request.status === 'APPROVED' ? 'text-green-700' :
                                            'text-red-700'
                                        }`}><span className="font-medium">Reason:</span> {order.replacement_request.reason}</p>}
                                        {order.replacement_request.admin_comment && (
                                            <p className={`text-xs mt-2 p-2 rounded border italic ${
                                                order.replacement_request.status === 'PENDING' ? 'bg-white/50 border-yellow-100' :
                                                order.replacement_request.status === 'APPROVED' ? 'bg-white/50 border-green-100' :
                                                'bg-white/50 border-red-100'
                                            }`}>
                                                <span className="font-bold not-italic">Support Team:</span> {order.replacement_request.admin_comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-6 space-y-8">
                        {/* Featured Item */}
                        {featuredItem && (
                            <section>
                                <h2 className="text-lg font-bold text-[#4C0A2E] mb-4 flex items-center">
                                    <FiShoppingBag className="mr-2" /> Item
                                </h2>
                                <div className="flex gap-6 p-6 rounded-xl border-2 border-[#BA7E38] bg-gradient-to-br from-orange-50/50 to-white shadow-md">
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <Image
                                            src={featuredItem.product?.productImageUrl?.[0] || '/images/home/img3.jpg'}
                                            alt={featuredItem.product?.productTitle || 'Product Image'}
                                            fill
                                            className="object-cover rounded-xl shadow-lg border-2 border-white"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xl font-bold text-[#4C0A2E]">{featuredItem.product?.productTitle}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <span className="font-semibold">Quantity: {featuredItem.quantity}</span>
                                        </p>
                                        {featuredItem.variant && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Variant: {featuredItem.variant.name || 'Default'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Cancellation Info on Right Side */}
                                    {isFeaturedItemCancelled && (() => {
                                        const cancelledItem = order.cancelled_items?.find(
                                            c => c.product.toString() === featuredProductIdStr &&
                                                 (featuredVariantIdStr ? c.variant?.toString() === featuredVariantIdStr : !c.variant)
                                        );
                                        if (!cancelledItem) return null;
                                        return (
                                            <div className="flex flex-col justify-center text-right">
                                                <p className="text-sm font-bold text-red-600">This Item Has Been Cancelled</p>
                                                <p className="text-xs text-red-600 mt-2">{cancelledItem.reason}</p>
                                                <p className="text-xs text-red-600 mt-2">
                                                    Cancelled on {new Date(cancelledItem.cancelledAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </section>
                        )}

                        {/* Other Items in this Order */}
                        {otherItems.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-[#4C0A2E] mb-4 flex items-center">
                                    <FiShoppingBag className="mr-2" /> Other Items in this Order
                                </h2>
                                <div className="space-y-3">
                                    {otherItems.map((item, i) => {
                                        // Check if this item is cancelled
                                        const itemProductId = item.product?._id || item.product;
                                        const itemVariantId = item.variant?._id || item.variant || null;
                                        const isItemCancelled = order.cancelled_items?.some(
                                            c => c.product.toString() === itemProductId?.toString() &&
                                                 (itemVariantId ? c.variant?.toString() === itemVariantId.toString() : !c.variant)
                                        );

                                        // Check for item-level return/replacement requests
                                        const otherItemReturnReq = order.item_return_requests?.find(
                                            r => r.product?.toString() === itemProductId?.toString()
                                        );
                                        const otherItemReplacementReq = order.item_replacement_requests?.find(
                                            r => r.product?.toString() === itemProductId?.toString()
                                        );

                                        // Determine per-item status label
                                        let otherItemStatusLabel = null;
                                        if (otherItemReturnReq) {
                                            const statusMap = { PENDING: 'Return Requested', APPROVED: 'Return Approved', REJECTED: 'Return Rejected' };
                                            otherItemStatusLabel = statusMap[otherItemReturnReq.status];
                                        } else if (otherItemReplacementReq) {
                                            const statusMap = { PENDING: 'Replacement Requested', APPROVED: 'Replacement Approved', REJECTED: 'Replacement Rejected' };
                                            otherItemStatusLabel = statusMap[otherItemReplacementReq.status];
                                        }

                                        return (
                                            <div
                                                key={i}
                                                className={`flex gap-4 p-4 rounded-xl border ${
                                                    isItemCancelled
                                                        ? 'border-red-200 bg-red-50/30'
                                                        : otherItemReturnReq || otherItemReplacementReq
                                                            ? 'border-blue-200 bg-blue-50/30 hover:bg-blue-100/30'
                                                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
                                                } transition cursor-pointer`}
                                                onClick={() => router.push(`/account/order/${order._id}?productId=${itemProductId}`)}
                                            >
                                                <div className="relative w-20 h-20 flex-shrink-0">
                                                    <Image
                                                        src={item.product?.productImageUrl?.[0] || '/images/home/img3.jpg'}
                                                        alt={item.product?.productTitle || 'Product Image'}
                                                        fill
                                                        className="object-cover rounded-lg shadow-sm"
                                                    />
                                                    {isItemCancelled && (
                                                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">CANCELLED</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#4C0A2E]">{item.product?.productTitle}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    {item.variant && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Variant: {item.variant.name || 'Default'}
                                                        </p>
                                                    )}
                                                    {isItemCancelled && (
                                                        <p className="text-xs text-red-600 font-medium mt-1">
                                                            ✓ Item Cancelled
                                                        </p>
                                                    )}
                                                    {otherItemStatusLabel && !isItemCancelled && (
                                                        <p className="text-xs text-blue-600 font-medium mt-1">
                                                            {otherItemStatusLabel}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right flex flex-col justify-center">
                                                    <button className="text-xs text-[#BA7E38] hover:underline">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

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
                                        <p className={`font-bold text-base uppercase mt-1 ${
                                            isFeaturedItemCancelled || featuredItemStatus === 'CANCELLED' ? 'text-red-600' : 'text-[#BA7E38]'
                                        }`}>
                                            {featuredItemStatus?.replace(/_/g, ' ')}
                                        </p>
                                        {order.deliveredAt && !isFeaturedItemCancelled && (
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
                                    {/* Item-level pricing */}
                                    {featuredItem && (() => {
                                        const itemPrice = featuredItem.price || featuredItem.product?.salePrice || 0;
                                        const itemSubtotal = itemPrice * featuredItem.quantity;

                                        // Calculate proportional coupon discount for this item
                                        const orderSubtotal = order.orderTotal || 0;
                                        const itemCouponDiscount = order.coupon_discount > 0 && orderSubtotal > 0
                                            ? Math.round((itemSubtotal / orderSubtotal) * order.coupon_discount)
                                            : 0;

                                        const itemTotal = itemSubtotal - itemCouponDiscount;

                                        return (
                                            <>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Item Price (₹{itemPrice} × {featuredItem.quantity})</span>
                                                    <span>₹{itemSubtotal}.00</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Shipping</span>
                                                    <span className="text-green-600 font-medium">FREE</span>
                                                </div>
                                                {itemCouponDiscount > 0 && (
                                                    <div className="flex justify-between text-sm text-green-600 font-medium">
                                                        <span>Coupon Discount (Item Share)</span>
                                                        <span>- ₹{itemCouponDiscount}.00</span>
                                                    </div>
                                                )}
                                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center font-bold text-xl text-[#4C0A2E]">
                                                    <span>Item Total</span>
                                                    <span className="text-[#BA7E38]">₹{itemTotal}.00</span>
                                                </div>
                                            </>
                                        );
                                    })()}
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 my-8 mt-32I max-h-[80vh] overflow-y-auto">
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
                                {canCancel && (
                                    <button
                                        onClick={() => setRequestType('cancel')}
                                        className="w-full p-5 rounded-xl bg-red-50 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 transition-all group flex items-center gap-4 cursor-pointer active:scale-95"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white group-hover:bg-red-600 transition-colors flex-shrink-0">
                                            <span className="text-xl font-bold">×</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-red-700 text-base">Cancel Order</p>
                                            <p className="text-sm text-red-500 mt-0.5">Cancel before processing</p>
                                        </div>
                                    </button>
                                )}

                                {canReturn ? (
                                    <button
                                        onClick={() => setRequestType('return')}
                                        className="w-full p-5 rounded-xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all group flex items-center gap-4 cursor-pointer active:scale-95"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors flex-shrink-0">
                                            <FiArrowLeft className="text-xl font-bold" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-blue-700 text-base">Return Order</p>
                                            <p className="text-sm text-blue-500 mt-0.5">Return items within 7 days of delivery</p>
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
                                        className="w-full p-5 rounded-xl bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all group flex items-center gap-4 cursor-pointer active:scale-95"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white group-hover:bg-purple-600 transition-colors flex-shrink-0">
                                            <FiShoppingBag className="text-xl font-bold" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-purple-700 text-base">Replacement Order</p>
                                            <p className="text-sm text-purple-500 mt-0.5">Exchange for a fresh item (within 7 days)</p>
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
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-5">
                                        <div>
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

                                        {(requestType === 'return' || requestType === 'replacement') && (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Upload Product Photos <span className="text-red-500">*</span>
                                                </label>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Upload images showing the issue (max 5 images, 5MB each) - At least 1 required
                                                </p>

                                                <div className="space-y-3">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#BA7E38] hover:bg-orange-50/30 transition">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                                                            <p className="mb-1 text-sm text-gray-500">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-400">JPG, PNG, or WEBP (max 5MB)</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            multiple
                                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                                            onChange={handleImageUpload}
                                                            disabled={uploadingImages || proofImages.length >= 5}
                                                        />
                                                    </label>

                                                    {proofImages.length > 0 && (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {proofImages.map((image, index) => (
                                                                <div key={index} className="relative group">
                                                                    <Image
                                                                        src={image}
                                                                        alt={`Proof ${index + 1}`}
                                                                        width={100}
                                                                        height={100}
                                                                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index)}
                                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <FiX className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {uploadingImages && (
                                                        <div className="text-center py-2">
                                                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#BA7E38] border-r-transparent"></div>
                                                            <p className="text-xs text-gray-500 mt-2">Processing images...</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setRequestType(null);
                                            setSelectedReason('');
                                            setRequestReason('');
                                            setProofImages([]);
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
