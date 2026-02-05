"use client"
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUserDetails, updateUser, getUserOrders, clearUserDataOnLogout, addToCart } from '@/api/auth';
import OrderItem from "@/app/components/account/order-item"
import AccountDetails from "@/app/components/account/account-details"
import HeroCard from "@/app/components/account/hero-card"
import AddressFields from '@/app/components/AddressFields';
import { FiLogOut, FiUser, FiHome } from 'react-icons/fi';
const ORDERS = [
  {
    id: "1",
    title: "Cosmic Body Oil",
    price: "₹ 1,299.00",
    status: "delivered",
    itemsCount: 2,
    imageAlt: "Cosmic Body Oil bottle with plant",
  },
  {
    id: "2",
    title: "Cosmic Body Oil",
    price: "₹ 1,299.00",
    status: "delivered",
    itemsCount: 2,
    imageAlt: "Cosmic Body Oil bottle with plant",
  },
]

// ... (REALM_CONTENT and PALACE_CONTENT definitions remain the same as the previous response)
const REALM_CONTENT = {
    title: "Order History",
    component: (
        <div className="space-y-4">
            {ORDERS.map((o) => (
                <OrderItem
                    key={o.id}
                    title={o.title}
                    price={o.price}
                    statusLabel="Delivered Successfully"
                    itemsCount={o.itemsCount}
                    imageAlt={o.imageAlt}
                />
            ))}
        </div>
    )
}

// PALACE (Address) content will be rendered dynamically inside the component

// --- ACCOUNT PAGE COMPONENT ---

// Inner component that uses useSearchParams
function AccountPageContent() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    
    // Set initial state based on URL parameter or default to 'palace'
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'palace');
    
    // Update active tab when URL parameter changes
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const [addressForm, setAddressForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                        const user = await getUserDetails();
                        // Use the shippingAddress object exclusively (no top-level fallbacks)
                        const addr = user?.shippingAddress || {};
                        setAddressForm({
                            firstName: addr.firstName || '',
                            lastName: addr.lastName || '',
                            email: addr.email || '',
                            company: addr.company || '',
                            street: addr.street || '',
                            city: addr.city || '',
                            state: addr.state || '',
                            zip: addr.zip || '',
                            country: addr.country || 'India',
                            phoneNumber: addr.phoneNumber || ''
                        });
            } catch (err) {
                console.error('Failed to load user details for account page', err);
            }
        };
        load();
    }, []);

    // Load user orders when the realm tab becomes active
    useEffect(() => {
        const loadOrders = async () => {
            if (activeTab !== 'realm') return;
            try {
                const data = await getUserOrders();
                // Normalize possible response shapes from backend
                // backend returns: successRes(res, { orders }) -> data = { orders: [...] }
                let list = [];
                if (Array.isArray(data)) {
                    list = data;
                } else if (data?.orders && Array.isArray(data.orders)) {
                    list = data.orders;
                } else if (data?.data && Array.isArray(data.data)) {
                    list = data.data;
                } else if (data?.data?.orders && Array.isArray(data.data.orders)) {
                    list = data.data.orders;
                }
                setOrders(list);
            } catch (err) {
                console.error('Failed to load orders', err);
            }
        };
        loadOrders();
    }, [activeTab]);

    // Flatten orders into per-product entries and sort by order date desc
    // Group duplicate products within same order (in case backend sends duplicates)
    const productEntries = useMemo(() => {
        if (!orders || !orders.length) return [];
        
        const entries = orders.flatMap((order) => {
            if (!order.products || !order.products.length) return [];
            
            // Group products by unique identifier (productId + variantId)
            const productMap = new Map();
            
            order.products.forEach((item) => {
                // Create unique key for each product (including variant if exists)
                const productId = item.product?._id || item.productId;
                const variantId = item.variant?._id || item.variantId || '';
                const uniqueKey = `${productId}-${variantId}`;
                
                if (productMap.has(uniqueKey)) {
                    // Product already exists, add quantity
                    const existing = productMap.get(uniqueKey);
                    existing.item.quantity += (item.quantity || 1);
                } else {
                    // New product, add to map
                    productMap.set(uniqueKey, {
                        order,
                        item: { ...item }
                    });
                }
            });
            
            // Convert map back to array
            return Array.from(productMap.values());
        });
        
        // Sort by order date descending
        entries.sort((a, b) => 
            new Date(b.order?.createdAt || b.order?._id) - 
            new Date(a.order?.createdAt || a.order?._id)
        );
        
        return entries;
    }, [orders]);

    const mainContent = activeTab === 'realm'
        ? REALM_CONTENT
        : null; // palace handled inline below

    // Compute a safe heading title so we don't read .title from null
    const headingTitle = activeTab === 'realm' ? REALM_CONTENT.title : 'My Palace';

    const handleAddressChange = (key, value) => {
        setAddressForm(prev => ({ ...prev, [key]: value }));
        // clear field error on change
        setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validateForm = () => {
        const requiredFields = [
            'firstName',
            'lastName',
            'email',
            //'company', // hidden by design
            'street',
            'city',
            'state',
            'zip',
            'country',
            'phoneNumber'
        ];
        const newErrors = {};
        requiredFields.forEach((f) => {
            if (!addressForm[f] || String(addressForm[f]).trim() === '') {
                newErrors[f] = 'This field is required';
            }
        });

        // basic email format
        if (addressForm.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addressForm.email)) {
            newErrors.email = 'Enter a valid email';
        }

        // basic phone format (10-15 digits)
        if (addressForm.phoneNumber && !/^[0-9+\-() ]{7,20}$/.test(addressForm.phoneNumber)) {
            newErrors.phoneNumber = 'Enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const ok = validateForm();
            if (!ok) {
                toast.error('Please fix validation errors');
                return;
            }

            // Send shippingAddress only; frontend should not update top-level user fields here
            const payload = { shippingAddress: addressForm };
            await updateUser(payload);
            toast.success('Profile and address updated');
        } catch (err) {
            console.error('Failed to update profile/address', err);
            toast.error('Failed to update profile/address');
        }
    };

    const router = useRouter();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        // Clear all user data (token, cart, wishlist)
        clearUserDataOnLogout();
        
        toast.success('Logged out successfully');
        setShowLogoutConfirm(false);
        router.push('/');
    };

    // Helper function to apply active/inactive styles to sidebar tabs
    const getTabClasses = (tabName) => {
        const baseClasses = "w-full text-left p-0 py-1 group flex items-center gap-2 cursor-pointer";
        const activeClasses = "text-[var(--brand-maroon)] font-medium";
        const inactiveClasses = "text-muted-foreground hover:text-[var(--brand-maroon)] transition-colors";
        
        // My Realm is styled differently (semibold header) but here we treat it as a nav item for alignment
        const nameClasses = tabName === 'realm' ? 'font-semibold' : 'font-normal';
        
        return `${baseClasses} ${nameClasses} ${activeTab === tabName ? activeClasses : inactiveClasses}`;
    }

    const getIndicatorClasses = (tabName) => {
        // The red arrow indicator
        return `inline-block h-0 w-0 border-y-4 border-l-6 border-y-transparent ${activeTab === tabName ? 'border-l-[var(--brand-maroon)]' : 'border-l-transparent'}`;
    }


    return (
        <div
            className="font-avenir-400"
            style={{
                "--brand-maroon": "oklch(0.45 0.15 20)",
                "--accent-gold": "oklch(0.78 0.12 80)",
                "--success-bg": "oklch(0.93 0.09 145)",
                "--success-fg": "oklch(0.32 0.05 145)",
                "--soft-border": "var(--color-border)",
            }}
        >
            <div className="mx-auto w-full mt-15 pl-6 px-6 py-8 md:py-12 ">
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <h1
                        className="text-balance font-rose text-2xl md:text-3xl font-medium tracking-wide text-[var(--brand-maroon)]"
                        style={{ color: 'var(--brand-maroon, #4C0A2E)' }}
                    >
                        {"My Account"}
                    </h1>
                </div>

                {/* Layout: sidebar | main | hero */}
                <div className="grid gap-0 lg:grid-cols-[200px_1fr_minmax(300px,650px)] items-start">
                    
                    {/* Sidebar */}
                    <aside className="pr-4"> {/* Added pr-4 for spacing */}
                        <nav aria-label="Account sections" className="rounded-lg bg-card p-0 text-sm">
                            <ul className="space-y-2">
                                {/* My Realm Button (Now first item in list for alignment) */}
                                <li>
                                    <button 
                                        onClick={() => setActiveTab('realm')} 
                                        className={`${getTabClasses('realm')}`}
                                        title="Profile"
                                        aria-label="Profile"
                                    >
                                        <FiUser className="text-sm mr-2" aria-hidden="true" />
                                        {"My Realm"}
                                    </button>
                                </li>

                                {/* My Palace Button (Vertically aligned) */}
                                <li>
                                    <button 
                                        onClick={() => setActiveTab('palace')} 
                                        className={`${getTabClasses('palace')}`}
                                        title="Location"
                                        aria-label="Location"
                                    >
                                        <FiHome className="text-sm mr-2" aria-hidden="true" />
                                        {"My Palace"}
                                    </button>
                                </li>
                                
                                {/* Prasthan - Icon before is sign out/arrow as in the design */}
                                <li className='pt-2'> {/* Added pt-2 for vertical separation */}
                                    <button onClick={() => setShowLogoutConfirm(true)} className="group flex items-center gap-2 text-[#FF0000] font-medium" title="Logout" aria-label="Logout">
                                            <FiLogOut className="text-md" />
                                            {"Prasthan"}
                                        </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main content - Renders based on activeTab state */}
                    <div className="space-y-6 pl-4 pr-5" style={{ borderLeft: '1px solid var(--soft-border, gray)' }}>
                        
                        {/* Greeting */}
                        <div className="text-sm md:text-base">
                            <p>
                                {`Hello ${addressForm?.firstName || 'Guest'} (Not ${addressForm?.firstName || 'Guest'}? `}
                                <button type="button" onClick={() => setShowLogoutConfirm(true)} className="underline text-[var(--brand-maroon)]">
                                    {"Log Out)"}
                                </button>
                                {""}
                            </p>
                        </div>

                        {/* Dynamic Main Section */}
                        <div
                            aria-labelledby="main-content-heading"
                            className="bg-card py-4"
                        >
                            <h2 id="main-content-heading" className="font-averin-400 mb-4 text-lg font-semibold text-[var(--brand-maroon)]">
                                {headingTitle} {/* Dynamic Heading */}
                            </h2>

                            {/* Conditional rendering of content */}
                            {activeTab === 'realm' ? (
                                <>
                                    <div style={{ maxHeight: 320, overflowY: 'auto' }} className="space-y-4">
                                        {productEntries && productEntries.length ? (
                                            productEntries.map(({ order, item }, idx) => {
                                              // Calculate hours since placement and delivery
                                              const hoursElapsed = (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
                                              const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt);
                                              const daysElapsed = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
                                              
                                              // Determine available actions
                                              const canCancel = order.order_status === 'PLACED' && hoursElapsed <= 48;
                                              const canReturn = order.order_status === 'DELIVERED' && daysElapsed <= 7;
                                              const canReplace = order.order_status === 'DELIVERED' && daysElapsed <= 7;
                                              const canBuyAgain = ['DELIVERED', 'CANCELLED_BY_USER', 'CANCELLED_BY_ADMIN', 'RETURNED'].includes(order.order_status);
                                              
                                              return (
                                                <div key={(order._id || '') + '-' + idx} className=" bg-white" onClick={() => router.push(`/account/order/${order._id}`)}>
                                                    <OrderItem
                                                        orderId={order._id}
                                                        order={order}
                                                        title={item.product?.productTitle || 'Product'}
                                                        price={
                                                            (item.price != null && item.price !== '')
                                                                ? item.price
                                                                : (item.product?.salePrice ?? '')
                                                        }
                                                        statusLabel={order.order_status || 'Pending'}
                                                        itemsCount={item.quantity}
                                                        imageAlt={item.product?.productTitle || ''}
                                                        imageSrc={item.product?.productImageUrl?.[0] || '/images/home/img3.jpg'}
                                                        orderDate={order.createdAt}
                                                        canBuyAgain={canBuyAgain}
                                                        onBuyAgain={(e) => { 
                                                            e.stopPropagation(); 
                                                            // Inline handleBuyAgain for simplicity or restore it
                                                            const fastBuyAgain = async () => {
                                                                try {
                                                                    for (const p of order.products) {
                                                                        await addToCart(p.product?._id || p.product, p.variant?._id || p.variant || "", p.quantity);
                                                                    }
                                                                    toast.success('Items added to cart');
                                                                    router.push('/checkout');
                                                                } catch (err) {
                                                                    toast.error('Failed to add items to cart');
                                                                }
                                                            };
                                                            fastBuyAgain();
                                                        }}
                                                        onViewDetails={() => router.push(`/account/order/${order._id}`)}
                                                    />
                                                </div>
                                              );
                                            })
                                        ) : (
                                            <div className="text-sm text-muted-foreground">No orders found.</div>
                                        )}
                                    </div>
                                    {/* Account Details for Realm tab */}
                                    <div
                                        aria-labelledby="account-details-heading"
                                        className="bg-card p-4 mt-6 border-t border-[var(--soft-border, gray)]"
                                    >
                                        <h2 id="account-details-heading" className="mb-4 text-lg font-semibold text-[var(--brand-maroon)]">
                                            {"Account Details"}
                                        </h2>
                                        <AccountDetails name={addressForm.firstName + ' ' + addressForm.lastName} email={addressForm.email} />
                                        <div className="pt-4">
                                            <button
                                                type="button"
                                                className="inline-flex h-10 items-center justify-center rounded-full px-8 text-sm font-medium"
                                                style={{
                                                    background: "#BA7E38",
                                                    color: "white",
                                                }}
                                            >
                                                {"View Address"}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Address Details for Palace tab - dynamic form
                                <form onSubmit={handleSaveAddress} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="sr-only">First Name</label>
                                            <input value={addressForm.firstName} onChange={(e) => handleAddressChange('firstName', e.target.value)} type="text" placeholder="First Name" className="w-full p-2 border border-gray-300 rounded" />
                                            {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="sr-only">Last Name</label>
                                            <input value={addressForm.lastName} onChange={(e) => handleAddressChange('lastName', e.target.value)} type="text" placeholder="Last Name" className="w-full p-2 border border-gray-300 rounded" />
                                            {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="sr-only">Email</label>
                                        <input value={addressForm.email} onChange={(e) => handleAddressChange('email', e.target.value)} type="email" placeholder="Email Address" className="w-full p-2 border border-gray-300 rounded" />
                                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Company field is temporarily hidden per request */}
                                    {/* <input value={addressForm.company} onChange={(e) => handleAddressChange('company', e.target.value)} type="text" placeholder="Company" className="w-full p-2 border border-gray-300 rounded" /> */}

                                    <div>
                                        <label className="sr-only">Street</label>
                                        <input value={addressForm.street} onChange={(e) => handleAddressChange('street', e.target.value)} type="text" placeholder="Address" className="w-full p-2 border border-gray-300 rounded" />
                                        {errors.street && <p className="text-sm text-red-600 mt-1">{errors.street}</p>}
                                    </div>

                                    {/* Address Fields: Country, State, City (Searchable Dropdowns) */}
                                    <div>
                                        <AddressFields
                                            address={addressForm}
                                            onChange={(updatedAddress) => {
                                                setAddressForm(updatedAddress);
                                            }}
                                            errors={errors}
                                            disabled={false}
                                            showLabels={false}
                                            layout="grid"
                                        />
                                    </div>

                                    <div>
                                        <label className="sr-only">Zip</label>
                                        <input value={addressForm.zip} onChange={(e) => handleAddressChange('zip', e.target.value)} type="text" placeholder="Zip Code" className="w-full p-2 border border-gray-300 rounded" />
                                        {errors.zip && <p className="text-sm text-red-600 mt-1">{errors.zip}</p>}
                                    </div>

                                    <div>
                                        <label className="sr-only">Phone</label>
                                        <input value={addressForm.phoneNumber} onChange={(e) => handleAddressChange('phoneNumber', e.target.value)} type="tel" placeholder="Phone" className="w-full p-2 border border-gray-300 rounded" />
                                        {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>}
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex h-10 items-center justify-center rounded-full px-8 text-sm font-medium"
                                            style={{
                                                background: "#BA7E38",
                                                color: "white",
                                            }}
                                        >
                                            {"Save Address"}
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>

                    {/* Hero image card */}
                    <div className="lg:h-full -mt-15">
                        <div className="h-full">
                            <HeroCard activeTab={activeTab} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Logout confirmation modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirm Prasthan</h3>
                        <p className="mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={handleLogout} className="px-4 py-2 bg-[#BA7E38] text-white rounded">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Main exported component with Suspense boundary
export default function AccountPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BA7E38] border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <AccountPageContent />
        </Suspense>
    );
}