// app/order-success/page.js
'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function OrderSuccessPage() {
    useEffect(() => {
        // Clear cart from localStorage on successful order
        localStorage.removeItem('userCart');
    }, []);

    return (
        <div className="bg-[#F7F7F7] pt-[83px] min-h-screen">
            <div className="max-w-[1440px] w-full mx-auto px-[20px] py-16">
                <div className="text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-[#BA7E38] mb-4">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-[#3C3C3C] text-base sm:text-lg max-w-[600px] mx-auto mb-8">
                        Thank you for your purchase! Your order has been successfully placed and is being processed.
                        You will receive an email confirmation shortly with your order details.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/feature-products">
                            <button className="bg-[#BA7E38] text-white px-8 py-3 rounded-[20px] font-semibold hover:bg-[#a96f2e] transition">
                                Continue Shopping
                            </button>
                        </Link>

                        <Link href="/account?tab=realm">
                            <button className="border-2 border-[#BA7E38] text-[#BA7E38] px-8 py-3 rounded-[20px] font-semibold hover:bg-[#BA7E38] hover:text-white transition">
                                View Order History
                            </button>
                        </Link>
                    </div>

                    <div className="mt-12 bg-white p-6 rounded-[20px] shadow-md max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-[#3C3C3C]">What&apos;s Next?</h3>
                        <ul className="text-left text-[#3C3C3C] space-y-2">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#BA7E38] rounded-full mr-3"></span>
                                Order confirmation email sent
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#BA7E38] rounded-full mr-3"></span>
                                Processing your order
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#BA7E38] rounded-full mr-3"></span>
                                Shipping notification within 24 hours
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#BA7E38] rounded-full mr-3"></span>
                                Track your order in account dashboard
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}