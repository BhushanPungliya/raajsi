// app/checkout/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
    getUserCart, 
    getUserDetails, 
    placeOrder, 
    createRazorpayOrder, 
    verifyRazorpayPayment, 
    updateAddress, 
    removeUserCart, 
    mergeGuestCartWithUserCart,
    validateCoupon,
    applyCoupon,
    getAvailableCoupons
} from '@/api/auth';
import OTPLogin from '@/app/components/OTPLogin';
import AddressFields from '@/app/components/AddressFields';

export default function CheckoutPage() {
    const [cartData, setCartData] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [removingItems, setRemovingItems] = useState({});
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
    });
    const [addressError, setAddressError] = useState('');
    const [addressErrors, setAddressErrors] = useState({});
    
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [availableCoupons, setAvailableCoupons] = useState([]);

    const router = useRouter();

    useEffect(() => {
        // Load Razorpay script dynamically
        if (window.Razorpay) {
            setRazorpayLoaded(true);
        } else {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => setRazorpayLoaded(true);
            script.onerror = () => console.error('Failed to load Razorpay script');
            document.head.appendChild(script);
        }

        const initializeCheckout = async () => {
            try {
                // Check if user is logged in
                const token = localStorage.getItem('token');
                const isLoggedIn = !!token;

                if (isLoggedIn) {
                    // Logged-in user: fetch user details and cart from server
                    const [userData, cartResponse] = await Promise.all([
                        getUserDetails(),
                        getUserCart()
                    ]);

                    // `getUserDetails()` returns the user object (or a wrapper). normalize it
                    const actualUser = userData?.data || userData || null;
                    setUser(actualUser);
                    setCartData(cartResponse?.data?.products || []);

                    // Fetch available coupons
                    if (cartResponse?.data?.products?.length > 0) {
                        const total = cartResponse.data.products.reduce(
                            (acc, item) => acc + (item.productId?.salePrice || item.productId?.price || 0) * item.quantity,
                            0
                        );
                        const categoryIds = cartResponse.data.products.map(item => item.productId?.category).filter(Boolean);
                        try {
                            const couponsResp = await getAvailableCoupons(total, categoryIds.join(','));
                            setAvailableCoupons(couponsResp?.data?.coupons || []);
                        } catch (err) {
                            console.error('Error fetching coupons:', err);
                        }
                    }

                    // Pre-fill address from user's shippingAddress
                    const addr = actualUser?.shippingAddress || {};
                    setShippingAddress(prev => ({
                        ...prev,
                        firstName: addr.firstName || prev.firstName,
                        lastName: addr.lastName || prev.lastName,
                        email: addr.email || prev.email,
                        phoneNumber: addr.phoneNumber || prev.phoneNumber,
                        street: addr.street || prev.street,
                        city: addr.city || prev.city,
                        state: addr.state || prev.state,
                        zip: addr.zip || prev.zip,
                        country: addr.country || prev.country,
                    }));

                    // If name is present on user and firstName is empty, prefill from name
                    if (actualUser?.name && !addr?.firstName) {
                        const nameParts = actualUser.name.split(' ');
                        setShippingAddress(prev => ({
                            ...prev,
                            firstName: nameParts[0] || prev.firstName,
                            lastName: nameParts.slice(1).join(' ') || prev.lastName,
                            email: actualUser.email || prev.email,
                            phoneNumber: actualUser.phoneNumber || prev.phoneNumber,
                        }));
                    }
                } else {
                    // Guest user: load cart only (no address needed)
                    const localCart = localStorage.getItem('userCart');
                    let guestCartData = localCart ? JSON.parse(localCart) : [];
                    if (!Array.isArray(guestCartData)) {
                        guestCartData = [guestCartData];
                    }
                    setCartData(guestCartData);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing checkout:', error);
                toast.error('Failed to load checkout data');
            } finally {
                setLoading(false);
            }
        };

        initializeCheckout();

        // Listen for localStorage changes (for guest cart updates)
        const handleStorageChange = (e) => {
            if (e.key === "userCart") {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Only update for guest users
                    try {
                        const localCart = localStorage.getItem('userCart');
                        let guestCartData = localCart ? JSON.parse(localCart) : [];

                        // Ensure cartData is always an array
                        if (!Array.isArray(guestCartData)) {
                            guestCartData = [guestCartData];
                        }

                        setCartData(guestCartData);
                    } catch (err) {
                        console.error("Error updating cart from storage:", err);
                    }
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [router]);

    const handleUpdateCart = async (productId, varientId = '') => {
        const key = `${productId}-${varientId || ''}`;
        try {
            // mark this item as removing to disable the button
            setRemovingItems(prev => ({ ...prev, [key]: true }));

            const token = localStorage.getItem('token');
            const isLoggedIn = !!token;

            if (isLoggedIn) {
                // Logged-in user: remove from server-side cart
                // find current item quantity
                const currentItem = cartData.find(
                    (item) => item.productId._id === productId && item.varientId === varientId
                );
                const quantity = currentItem?.quantity || 1;

                // Call API to remove from server-side cart
                await removeUserCart({ productId, varientId: varientId || '', quantity });

                // Re-fetch latest cart from server to stay authoritative
                const latestCartResp = await getUserCart();
                const latestProducts = latestCartResp?.data?.products || [];

                setCartData(latestProducts);
                try {
                    localStorage.setItem('userCart', JSON.stringify(latestProducts));
                } catch (e) {
                    // ignore localStorage errors
                }
            } else {
                // Guest user: remove from localStorage cart
                setCartData(prev => {
                    const updatedCart = prev.filter(
                        (item) => !(item.productId._id === productId && item.varientId === varientId)
                    );
                    try {
                        localStorage.setItem('userCart', JSON.stringify(updatedCart));
                    } catch (e) {
                        // ignore localStorage errors
                    }
                    return updatedCart;
                });
            }

            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            toast.error(error?.response?.data?.message || 'Failed to remove item');
        } finally {
            setRemovingItems(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const handleQuantityChange = (productId, varientId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartData(prev => prev.map(item =>
            (item.productId._id === productId && item.varientId === varientId)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const isAddressComplete = () => {
        const requiredFields = ['firstName', 'phoneNumber', 'email', 'street', 'city', 'state', 'zip'];
        return requiredFields.every(field => shippingAddress[field] && shippingAddress[field].trim() !== '');
    };

    const validateAddress = () => {
        const errs = {};
        const emailRe = /^\S+@\S+\.\S+$/;

        if (!shippingAddress.firstName || !shippingAddress.firstName.trim()) {
            errs.firstName = 'First name is required';
        }

        if (!shippingAddress.email || !emailRe.test(shippingAddress.email)) {
            errs.email = 'Please enter a valid email address';
        }

        const digits = (shippingAddress.phoneNumber || '').replace(/\D/g, '');
        if (!digits) {
            errs.phoneNumber = 'Phone number is required';
        } else if (digits.length < 10) {
            errs.phoneNumber = 'Phone number must be at least 10 digits';
        }

        if (!shippingAddress.street || !shippingAddress.street.trim()) {
            errs.street = 'Street address is required';
        }

        if (!shippingAddress.city || !shippingAddress.city.trim()) {
            errs.city = 'City is required';
        }

        if (!shippingAddress.state || !shippingAddress.state.trim()) {
            errs.state = 'State is required';
        }

        if (!shippingAddress.zip || !/^\d{6}$/.test((shippingAddress.zip || '').toString())) {
            errs.zip = 'ZIP code must be a 6 digit number';
        }

        return errs;
    };

    const handleSaveAddress = async () => {
        setAddressError('');
        setAddressErrors({});
        const errs = validateAddress();
        if (Object.keys(errs).length > 0) {
            setAddressErrors(errs);
            setAddressError('Please fix the errors in the form.');
            toast.error('Please fix the errors in the form.');
            return;
        }
        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;

        if (isLoggedIn) {
            try {
                await updateAddress(shippingAddress);
                toast.success('Address updated successfully');
            } catch (error) {
                toast.error('Failed to update address');
                return; // Don't close edit mode on error
            }
        }

        setAddressErrors({});
        setIsEditingAddress(false);
    };

    const handleCancelEdit = () => {
        // Reset to original address from user data
        if (user?.shippingAddress) {
            const addrRaw = user.shippingAddress;
            const userAddr = Array.isArray(addrRaw) ? addrRaw[0] || {} : addrRaw || {};
            setShippingAddress(prev => ({
                ...prev,
                ...userAddr
            }));
        }
        setAddressErrors({});
        setIsEditingAddress(false);
    };

    const handleValidateCoupon = async (options = {}) => {
        // Robust check: if options is a React Event (object with preventDefault), or any object that isn't {silent: true}, it's NOT silent.
        const isSilent = options === true || (options && options.silent === true);
        
        if (!couponCode.trim()) {
            if (!isSilent) toast.error('Please enter a coupon code');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            if (!isSilent) {
                toast.info('Please login to use coupons');
                setShowLoginModal(true);
            }
            return;
        }

        if (!isSilent) setValidatingCoupon(true);
        console.log(`Validating coupon: ${couponCode.trim()} (Silent: ${isSilent})`);
        
        try {
            const currentSubtotal = cartData.reduce(
                (acc, item) => acc + (item.productId?.salePrice || item.productId?.price || 0) * item.quantity,
                0
            );

            const cartItems = cartData.map(item => ({
                productId: item.productId?._id,
                categoryId: item.productId?.category,
                quantity: item.quantity,
                price: item.productId?.salePrice || item.productId?.price || 0
            }));

            const response = await validateCoupon({
                couponCode: couponCode.trim(),
                cartAmount: currentSubtotal,
                cartItems
            });

            console.log('Coupon validation response:', response);

            if (response.data && response.data.isValid) {
                setAppliedCoupon(response.data.coupon);
                setDiscountAmount(response.data.discount);
                if (!isSilent) toast.success(response.data.message || 'Coupon applied successfully!');
            } else {
                if (!isSilent) {
                    toast.error(response.data?.errors?.[0] || response.data?.message || 'Invalid coupon code');
                } else {
                    // If it was applied but now invalid, remove it
                    setAppliedCoupon(null);
                    setDiscountAmount(0);
                    setCouponCode('');
                    toast.warn('Coupon removed as it is no longer valid for your cart.');
                }
            }
        } catch (error) {
            console.error('Error validating coupon:', error);
            if (!isSilent) toast.error(error?.message || error?.error?.message || 'Failed to validate coupon');
        } finally {
            if (!isSilent) setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
        toast.info('Coupon removed');
    };

    const subtotal = cartData.reduce(
        (acc, item) => acc + (item.productId?.salePrice || item.productId?.price || 0) * item.quantity,
        0
    );
    const shipping = subtotal > 0 && subtotal < 1000 ? 100 : 0; // Updated shipping logic if needed, but keeping it consistent with discount
    const total = Math.max(0, subtotal + shipping - discountAmount);

    useEffect(() => {
        if (appliedCoupon) {
            handleValidateCoupon(true); // Silent re-validation on cart changes
        }
    }, [cartData.length]); // Re-validate if items are added/removed

    useEffect(() => {
        if (appliedCoupon && subtotal < (appliedCoupon.minCartAmount || 0)) {
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setCouponCode('');
            toast.warn(`Coupon removed as subtotal is below ₹${appliedCoupon.minCartAmount}`);
        }
    }, [subtotal, appliedCoupon]);

    // Handle successful login from modal
    const handleLoginSuccess = async () => {
        setShowLoginModal(false);
        
        try {
            // Merge guest cart with user cart
            await mergeGuestCartWithUserCart();
            
            // Reload user details and cart
            const [userData, cartResponse] = await Promise.all([
                getUserDetails(),
                getUserCart()
            ]);
            
            const actualUser = userData?.data || userData || null;
            setUser(actualUser);
            setCartData(cartResponse?.data?.products || []);

            // Fetch available coupons
            if (cartResponse?.data?.products?.length > 0) {
                const total = cartResponse.data.products.reduce(
                    (acc, item) => acc + (item.productId?.salePrice || item.productId?.price || 0) * item.quantity,
                    0
                );
                const categoryIds = cartResponse.data.products.map(item => item.productId?.category).filter(Boolean);
                try {
                    const couponsResp = await getAvailableCoupons(total, categoryIds.join(','));
                    setAvailableCoupons(couponsResp?.data?.coupons || []);
                } catch (err) {
                    console.error('Error fetching coupons:', err);
                }
            }
            
            // Pre-fill My Palace from user data if available
            if (actualUser) {
                // backend may return shippingAddress as object or as an array; normalize both shapes
                const addrRaw = actualUser.shippingAddress;
                const userAddr = Array.isArray(addrRaw) ? addrRaw[0] || {} : addrRaw || {};

                if (Object.keys(userAddr).length > 0) {
                    setShippingAddress(prev => ({
                        ...prev,
                        firstName: userAddr.firstName || prev.firstName,
                        lastName: userAddr.lastName || prev.lastName,
                        email: userAddr.email || actualUser.email || prev.email,
                        phoneNumber: userAddr.phoneNumber || actualUser.phoneNumber || prev.phoneNumber,
                        street: userAddr.street || prev.street,
                        city: userAddr.city || prev.city,
                        state: userAddr.state || prev.state,
                        zip: userAddr.zip || prev.zip,
                        country: userAddr.country || prev.country || 'India',
                    }));
                } else {
                    // If no saved address, at least pre-fill email and phone
                    setShippingAddress(prev => ({
                        ...prev,
                        email: actualUser.email || prev.email,
                        phoneNumber: actualUser.phoneNumber || prev.phoneNumber,
                    }));
                }
            }
            
            toast.success('Login successful! You can now proceed with checkout');
        } catch (error) {
            console.error('Error after login:', error);
            toast.error('Please refresh the page and try again');
        }
    };

    const handleProceedToPayment = async () => {
        // Prevent double submission
        if (processing) {
            console.log('⚠️ Already processing, ignoring duplicate click');
            return;
        }

        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;

        // Always require login before proceeding
        if (!isLoggedIn) {
            toast.info('Please login to proceed with checkout');
            setShowLoginModal(true);
            return;
        }

        // For logged-in users, check if user exists
        if (!user) {
            toast.error('Please refresh the page and try again');
            return;
        }

        // Validate My Palace
        if (!isAddressComplete()) {
            toast.error('Please complete your Palace details before proceeding to payment');
            setIsEditingAddress(true);
            return;
        }

        if (cartData.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setProcessing(true);

        try {
            // Only logged-in user flow now - create order in backend
            const orderData = {
                products: cartData.map(item => ({
                    product: item.productId._id,
                    variant: item.varientId || undefined,
                    quantity: item.quantity,
                    price: item.productId?.salePrice || item.productId?.price || 0
                })),
                shippingAddress,
                order_price: total,
                payment_mode: 'ONLINE',
                coupon_applied: appliedCoupon?._id || null,
                coupon_discount: discountAmount
            };

            const orderResponse = await placeOrder(orderData);
            console.log('📦 Order created:', orderResponse);
            const orderId = orderResponse.data.data._id;
            console.log('📦 Order ID extracted:', orderId);

            // Create Razorpay order
            const razorpayOrderData = {
                amount: total,
                currency: 'INR',
                receipt: `rcpt_${orderId}`,
                notes: {
                    orderId: orderId
                }
            };

            const razorpayResponse = await createRazorpayOrder(razorpayOrderData);
            // backend may return { order } or the raw order object
            const rzpOrder = razorpayResponse && razorpayResponse.order ? razorpayResponse.order : razorpayResponse;

            // Validate rzpOrder
            if (!rzpOrder || typeof rzpOrder.amount === 'undefined') {
                toast.error('Failed to create Razorpay order. Please try again!');
                setProcessing(false);
                return;
            }

            // Initialize Razorpay
            if (!razorpayLoaded || !window.Razorpay) {
                toast.error('Razorpay is not loaded. Please wait a moment and try again.');
                setProcessing(false);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: 'Raajsi',
                description: 'Purchase from Raajsi',
                order_id: rzpOrder.id,
                prefill: {
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    email: shippingAddress.email,
                    contact: shippingAddress.phoneNumber
                },
                notes: {
                    address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`
                },
                theme: {
                    color: '#BA7E38'
                },
                
                display: {
                    blocks: {
                        banks: {
                            name: 'All Payment Options',
                            instruments: [
                                { method: 'upi' },
                                { method: 'card' },
                                { method: 'wallet' },
                                { method: 'netbanking' }
                            ]
                        }
                    },
                    sequence: ['block.banks'],
                    preferences: {
                        show_default_blocks: false
                    }
                },
                handler: async function (response) {
                    try {
                        console.log('💳 Payment handler called');
                        console.log('💳 orderId in handler:', orderId);
                        console.log('💳 Razorpay response:', response);
                        
                        // Verify payment
                        const verificationData = {
                            orderId: orderId, // CRITICAL: Include orderId to update existing order
                            orderCreationId: rzpOrder.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            products: isLoggedIn ? cartData.map(item => ({
                                product: item.productId._id,
                                variant: item.varientId || undefined,
                                quantity: item.quantity,
                                price: item.productId?.salePrice || item.productId?.price || 0
                            })) : cartData.map(item => ({
                                productId: item.productId._id,
                                variantId: item.varientId || null,
                                quantity: item.quantity
                            })),
                            order_price: total,
                            coupon_applied: appliedCoupon?._id || null,
                            coupon_discount: discountAmount,
                            shippingAddress,
                            payment_mode: 'ONLINE',
                            isGuestOrder: !isLoggedIn,
                            // Include guest order data for creation after payment verification
                            ...(isLoggedIn ? {} : {
                                guestInfo: {
                                    email: shippingAddress.email,
                                    phoneNumber: shippingAddress.phoneNumber,
                                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
                                },
                                billingAddress: {
                                    firstName: shippingAddress.firstName,
                                    lastName: shippingAddress.lastName,
                                    email: shippingAddress.email,
                                    phoneNumber: shippingAddress.phoneNumber,
                                    street: shippingAddress.street,
                                    city: shippingAddress.city,
                                    state: shippingAddress.state,
                                    zip: shippingAddress.zip,
                                    country: shippingAddress.country,
                                    sameAsShipping: true
                                }
                            })
                        };

                        console.log('💳 Verification data being sent:', verificationData);

                        // Verify payment
                        const verificationResp = await verifyRazorpayPayment(verificationData);

                        if (verificationResp) {
                            // If coupon was used, commit it (increment usage)
                            if (appliedCoupon && isLoggedIn) {
                                try {
                                    const cartItems = cartData.map(item => ({
                                        productId: item.productId?._id,
                                        categoryId: item.productId?.category,
                                        quantity: item.quantity,
                                        price: item.productId?.salePrice || item.productId?.price || 0
                                    }));

                                    await applyCoupon({
                                        couponCode: appliedCoupon.couponCode,
                                        cartAmount: subtotal,
                                        cartItems
                                    });
                                    console.log('✅ Coupon usage committed');
                                } catch (couponErr) {
                                    console.error('Failed to commit coupon usage:', couponErr);
                                }
                            }
                        }

                        if (isLoggedIn) {
                            // For logged-in users, update cart from server response
                            const updatedCart = verificationResp?.data?.updatedCart || verificationResp?.updatedCart;
                            if (updatedCart) {
                                try {
                                    setCartData(updatedCart.products || []);
                                    localStorage.setItem('userCart', JSON.stringify(updatedCart.products || []));
                                } catch (localErr) {
                                    console.warn('Failed to update local cart state from verification response:', localErr);
                                }
                            } else {
                                // Fallback: clear local cart
                                try {
                                    setCartData([]);
                                    localStorage.removeItem('userCart');
                                } catch (localErr) {
                                    console.warn('Failed to clear local cart state (fallback):', localErr);
                                }
                            }
                        } else {
                            // For guest users, clear local cart
                            try {
                                setCartData([]);
                                localStorage.removeItem('userCart');
                            } catch (localErr) {
                                console.warn('Failed to clear local cart state for guest:', localErr);
                            }
                        }

                        toast.success('Payment successful! Redirecting...');
                        router.push('/order-success');
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                        toast.info('Payment cancelled');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error(error.message || 'Failed to initiate payment');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F7F7F7] pt-[83px] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA7E38] mx-auto"></div>
                    <p className="mt-4 text-[#3C3C3C]">Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-[#F7F7F7] pt-[83px]">
            <section className="py-16 px-5 sm:px-10 lg:px-20 text-center rounded-b-[30px]">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#BA7E38] mb-4">
                    Ready to Checkout?
                </h1>
                <p className="text-[#3C3C3C] text-base sm:text-lg max-w-[600px] mx-auto">
                    Review your order below, adjust quantities if needed, and proceed to payment. We ensure a smooth and secure checkout experience.
                </p>
            </section>

            <div className="max-w-[1440px] w-full mx-auto lg:pb-[100px] pb-[50px] lg:px-[100px] px-[20px]">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left: Cart Items and My Palace */}
                    <div className="flex-1 space-y-6">
                        {/* Cart Items */}
                        <div className="bg-white p-6 rounded-[20px] shadow-md">
                            <h2 className="text-xl font-semibold mb-6">Your Cart</h2>

                            {cartData.length === 0 ? (
                                <p className="text-[#888]">Your cart is empty.</p>
                            ) : (
                                cartData.map((item) => (
                                    <div
                                        className="flex items-center gap-4 mb-6"
                                        key={`${item.productId._id}-${item.varientId || ''}`}
                                    >
                                        <div className="w-[160px] h-[110px] rounded-[20px] overflow-hidden relative">
                                            <Image
                                                src={item.productId?.productImageUrl?.[0] || '/images/placeholder.jpg'}
                                                alt={item.productId?.productTitle || 'Product'}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded-[20px]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h6 className="text-[16px] tracking-[0.04em] text-[#3C3C3C]">
                                                {item.productId?.productTitle || 'Product'}
                                            </h6>
                                            <p className="text-[16px] tracking-[0.04em] text-[#3C3C3C] pb-[8px]">
                                                ₹ {item.productId?.salePrice || item.productId?.price || 0}.00
                                            </p>

                                            <div className="flex justify-between items-center w-full">
                                                {
                                                    (() => {
                                                        const key = `${item.productId._id}-${item.varientId || ''}`;
                                                        const isRemoving = !!removingItems[key];
                                                        return (
                                                            <button
                                                                onClick={() => handleUpdateCart(item.productId._id, item.varientId)}
                                                                className="bg-[#BA7E38] rounded-[22px] py-[5px] px-[18px] text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                                                disabled={isRemoving}
                                                            >
                                                                {isRemoving ? 'Removing...' : 'Remove'}
                                                            </button>
                                                        );
                                                    })()
                                                }

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(
                                                            item.productId._id,
                                                            item.varientId,
                                                            item.quantity - 1
                                                        )}
                                                        className="bg-[#12121226] h-[28px] w-[28px] rounded-full flex items-center justify-center text-lg"
                                                    >
                                                        -
                                                    </button>

                                                    <p className="text-[16px]">{item.quantity}</p>

                                                    <button
                                                        onClick={() => handleQuantityChange(
                                                            item.productId._id,
                                                            item.varientId,
                                                            item.quantity + 1
                                                        )}
                                                        className="bg-[#12121226] h-[28px] w-[28px] rounded-full flex items-center justify-center text-lg"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* My Palace - Only show for logged-in users */}
                        {user && (
                            <div className="bg-white p-6 rounded-[20px] shadow-md">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">My Palace</h2>
                                    {!isEditingAddress && (
                                        <button
                                            onClick={() => setIsEditingAddress(true)}
                                            className="bg-[#BA7E38] text-white px-4 py-2 rounded-lg hover:bg-[#a96f2e] transition"
                                        >
                                            Edit Palace
                                        </button>
                                    )}
                                </div>

                            {!isEditingAddress ? (
                                // Display Address
                                <div className="space-y-3">
                                    {isAddressComplete() ? (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Full Name</p>
                                                    <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium">{shippingAddress.email ? shippingAddress.email : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-medium">{shippingAddress.phoneNumber ? shippingAddress.phoneNumber : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Country</p>
                                                    <p className="font-medium">{shippingAddress.country}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-600">Address</p>
                                                <p className="font-medium">
                                                    {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                            <p className="text-red-600 font-medium">⚠️ My Palace is incomplete</p>
                                            <p className="text-red-500 text-sm mt-1">Please add your complete My Palace to proceed with checkout.</p>
                                            <button
                                                onClick={() => setIsEditingAddress(true)}
                                                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                            >
                                                Add Palace
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Edit Address Form
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingAddress.firstName}
                                                onChange={(e) => {
                                                    setShippingAddress(prev => ({ ...prev, firstName: e.target.value }));
                                                    setAddressErrors(prev => ({ ...prev, firstName: '' }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                                                required
                                                aria-invalid={addressErrors.firstName ? 'true' : 'false'}
                                            />
                                            {addressErrors.firstName && <p className="text-sm text-red-600 mt-1">{addressErrors.firstName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingAddress.lastName}
                                                onChange={(e) => {
                                                    setShippingAddress(prev => ({ ...prev, lastName: e.target.value }));
                                                    setAddressErrors(prev => ({ ...prev, lastName: '' }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={shippingAddress.email}
                                                onChange={(e) => {
                                                    setShippingAddress(prev => ({ ...prev, email: e.target.value }));
                                                    setAddressErrors(prev => ({ ...prev, email: '' }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                                                required
                                                aria-invalid={addressErrors.email ? 'true' : 'false'}
                                            />
                                            {addressErrors.email && <p className="text-sm text-red-600 mt-1">{addressErrors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={shippingAddress.phoneNumber}
                                                onChange={(e) => {
                                                    setShippingAddress(prev => ({ ...prev, phoneNumber: e.target.value }));
                                                    setAddressErrors(prev => ({ ...prev, phoneNumber: '' }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                                                required
                                                aria-invalid={addressErrors.phoneNumber ? 'true' : 'false'}
                                            />
                                            {addressErrors.phoneNumber && <p className="text-sm text-red-600 mt-1">{addressErrors.phoneNumber}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                                                Street Address *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingAddress.street}
                                                onChange={(e) => {
                                                    setShippingAddress(prev => ({ ...prev, street: e.target.value }));
                                                    setAddressErrors(prev => ({ ...prev, street: '' }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                                                required
                                                aria-invalid={addressErrors.street ? 'true' : 'false'}
                                            />
                                            {addressErrors.street && <p className="text-sm text-red-600 mt-1">{addressErrors.street}</p>}
                                        </div>

                                        {/* Address Fields: Country, State, City (Searchable Dropdowns) */}
                                        <div className="md:col-span-2">
                                            <AddressFields
                                                address={shippingAddress}
                                                onChange={(updatedAddress) => {
                                                    setShippingAddress(updatedAddress);
                                                    setAddressErrors(prev => ({ ...prev, city: '', state: '', country: '' }));
                                                }}
                                                disabled={false}
                                                showLabels={true}
                                                layout="grid"
                                            />
                                            {(addressErrors.city || addressErrors.state || addressErrors.country) && (
                                                <p className="text-sm text-red-600 mt-1">{addressErrors.city || addressErrors.state || addressErrors.country}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingAddress.zip}
                                                onChange={(e) => {
                                                    setShippingAddress(prev => ({ ...prev, zip: e.target.value }));
                                                    setAddressErrors(prev => ({ ...prev, zip: '' }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                                                required
                                                aria-invalid={addressErrors.zip ? 'true' : 'false'}
                                            />
                                            {addressErrors.zip && <p className="text-sm text-red-600 mt-1">{addressErrors.zip}</p>}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={handleSaveAddress}
                                            className="bg-[#BA7E38] text-white px-6 py-2 rounded-lg hover:bg-[#a96f2e] transition"
                                        >
                                            Save Palace
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    </div>

                    {/* Right: Order Summary (only show when cart has items) */}
                    {cartData.length > 0 && (
                        <div className="w-full lg:w-[380px] bg-white p-6 rounded-[20px] shadow-md h-fit">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="flex justify-between mb-3">
                                <p className="text-[#3C3C3C]">Subtotal</p>
                                <p className="font-semibold">₹ {subtotal}.00</p>
                            </div>

                            <div className="flex justify-between mb-3">
                                <p className="text-[#3C3C3C]">Shipping</p>
                                <p className="font-semibold">₹ {shipping}.00</p>
                            </div>

                            {/* Coupon Section */}
                            <div className="mt-4 mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BA7E38] text-sm"
                                        disabled={appliedCoupon || validatingCoupon}
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleValidateCoupon}
                                            disabled={validatingCoupon || !couponCode.trim()}
                                            className="bg-[#BA7E38] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#a96f2e] transition disabled:opacity-50"
                                        >
                                            {validatingCoupon ? "..." : "Apply"}
                                        </button>
                                    )}
                                </div>
                                {appliedCoupon && (
                                    <p className="text-green-600 text-xs mt-1 font-medium">
                                        Code {appliedCoupon.couponCode} applied!
                                    </p>
                                )}
                                
                                {availableCoupons.length > 0 && !appliedCoupon && (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Available Coupons</p>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                            {availableCoupons.map((coupon) => (
                                                <div 
                                                    key={coupon._id}
                                                    onClick={() => {
                                                        setCouponCode(coupon.couponCode);
                                                        // Automatically validate when clicking
                                                        setTimeout(() => handleValidateCoupon(), 0);
                                                    }}
                                                    className="border border-dashed border-[#BA7E38] p-2 rounded-lg cursor-pointer hover:bg-orange-50 transition"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-[#BA7E38]">{coupon.couponCode}</span>
                                                        <span className="text-[10px] bg-[#BA7E3826] text-[#BA7E38] px-2 py-0.5 rounded">
                                                            {coupon.couponType === 'PERCENTAGE' ? `${coupon.couponAmount}% OFF` : `₹${coupon.couponAmount} OFF`}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-600 mt-1 line-clamp-1">{coupon.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between mb-3 text-green-600">
                                    <p>Discount</p>
                                    <p className="font-semibold">- ₹ {discountAmount}.00</p>
                                </div>
                            )}

                            <hr className="my-4" />

                            <div className="flex justify-between mb-6">
                                <p className="text-lg font-semibold">Total</p>
                                <p className="text-lg font-semibold">₹ {total}.00</p>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                disabled={processing || cartData.length === 0 || !razorpayLoaded}
                                className="w-full bg-[#BA7E38] text-white py-3 rounded-[20px] text-lg font-semibold hover:bg-[#a96f2e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : !razorpayLoaded ? 'Loading Payment...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div 
                    className="auth-modal-overlay"
                    onClick={() => setShowLoginModal(false)}
                >
                    <div 
                        className="auth-modal-card"
                        onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="authModalTitle"
                    >
                        <OTPLogin 
                            setLoginOpen={setShowLoginModal}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
