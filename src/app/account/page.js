'use client' 

import { useState } from 'react';
import OrderItem from "@/app/components/account/order-item"
import AccountDetails from "@/app/components/account/account-details"
import HeroCard from "@/app/components/account/hero-card"
import { FiLogOut } from 'react-icons/fi'; 
// --- CONSTANTS AND DATA (Unchanged) ---
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

const PALACE_CONTENT = {
    title: "Address Details",
    component: (
        <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded" />
            <input type="email" placeholder="Email Address" className="w-full p-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Company" className="w-full p-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Address" className="w-full p-2 border border-gray-300 rounded" />
            <div className="flex space-x-4">
                <input type="text" placeholder="Country" defaultValue="India" className="w-1/2 p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="Zip Code" defaultValue="452339" className="w-1/2 p-2 border border-gray-300 rounded" />
            </div>
            <input type="tel" placeholder="Phone" defaultValue="+91 9898989898" className="w-full p-2 border border-gray-300 rounded" />
            <div className="pt-4">
                <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-full px-8 text-sm font-medium"
                    style={{
                        background: "#BA7E38",
                        color: "white",
                    }}
                >
                    {"Add Address"}
                </button>
            </div>
        </form>
    )
}

// --- ACCOUNT PAGE COMPONENT ---

export default function AccountPage() {
    // Set initial state to 'palace' to match the active state shown in your design image
    const [activeTab, setActiveTab] = useState('palace'); 

    const mainContent = activeTab === 'realm' 
        ? REALM_CONTENT 
        : PALACE_CONTENT;

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
                <div className="grid gap-0 lg:grid-cols-[200px_1fr_minmax(300px,800px)] items-start">
                    
                    {/* Sidebar */}
                    <aside className="pr-4"> {/* Added pr-4 for spacing */}
                        <nav aria-label="Account sections" className="rounded-lg bg-card p-0 text-sm">
                            <ul className="space-y-2">
                                {/* My Realm Button (Now first item in list for alignment) */}
                                <li>
                                    <button 
                                        onClick={() => setActiveTab('realm')} 
                                        className={getTabClasses('realm')}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={getIndicatorClasses('realm')}
                                            style={{ borderLeftColor: activeTab === 'realm' ? "oklch(0.45 0.15 20)" : 'transparent' }}
                                        />
                                        {"My Realm"}
                                    </button>
                                </li>

                                {/* My Palace Button (Vertically aligned) */}
                                <li>
                                    <button 
                                        onClick={() => setActiveTab('palace')} 
                                        className={getTabClasses('palace')}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={getIndicatorClasses('palace')}
                                            style={{ borderLeftColor: activeTab === 'palace' ? "oklch(0.45 0.15 20)" : 'transparent' }}
                                        />
                                        {"My Palace"}
                                    </button>
                                </li>
                                
                                {/* Prasthan - Icon before is sign out/arrow as in the design */}
                                <li className='pt-2'> {/* Added pt-2 for vertical separation */}
                                    <a href="#" className="group flex items-center gap-2 text-[#FF0000] font-medium">
                                        <FiLogOut className="text-md" />
                                        {"Prasthan"}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main content - Renders based on activeTab state */}
                    <div className="space-y-6 pl-4 pr-5" style={{ borderLeft: '1px solid var(--soft-border, gray)' }}>
                        
                        {/* Greeting */}
                        <div className="text-sm md:text-base">
                            <p>
                                {"Hello Vipul Sharma( Not Vipul Sharma? "}
                                <a href="#" className="underline text-[var(--brand-maroon)]">
                                    {"Log Out)"}
                                </a>
                                {""}
                            </p>
                        </div>

                        {/* Dynamic Main Section */}
                        <div
                            aria-labelledby="main-content-heading"
                            className="bg-card py-4"
                        >
                            <h2 id="main-content-heading" className="font-averin-400 mb-4 text-lg font-semibold text-[var(--brand-maroon)]">
                                {mainContent.title} {/* Dynamic Heading */}
                            </h2>

                            {/* Conditional rendering of content */}
                            {activeTab === 'realm' ? (
                                <>
                                    {REALM_CONTENT.component}
                                    {/* Account Details for Realm tab */}
                                    <div
                                        aria-labelledby="account-details-heading"
                                        className="bg-card p-4 mt-6 border-t border-[var(--soft-border, gray)]"
                                    >
                                        <h2 id="account-details-heading" className="mb-4 text-lg font-semibold text-[var(--brand-maroon)]">
                                            {"Account Details"}
                                        </h2>
                                        <AccountDetails name="Vipul Sharma" email="vipul@gmail.com" />
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
                                // Address Details for Palace tab
                                PALACE_CONTENT.component
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
        </div>
    )
}