// app/checkout/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CheckoutPage() {
    const [cartData, setCartData] = useState([
        {
            productId: {
                _id: '1',
                productTitle: 'Leather Jacket',
                salePrice: 4999,
                productImageUrl: ['/images/home/img3.jpg'],
            },
            quantity: 1,
        },
        {
            productId: {
                _id: '2',
                productTitle: 'Sneakers',
                salePrice: 2999,
                productImageUrl: ['/images/home/img3.jpg'],
            },
            quantity: 2,
        },
    ]);

    const handleUpdateCart = (id) => {
        setCartData(cartData.filter((item) => item.productId._id !== id));
    };

    const subtotal = cartData.reduce(
        (acc, item) => acc + item.productId.salePrice * item.quantity,
        0
    );
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    return (
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
                    {/* Left: Cart Items */}
                    <div className="flex-1 bg-white p-6 rounded-[20px] shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Your Cart</h2>

                        {cartData.length === 0 ? (
                            <p className="text-[#888]">Your cart is empty.</p>
                        ) : (
                            cartData.map((e) => (
                                <div
                                    className="flex items-center gap-4 mb-6"
                                    key={e.productId._id}
                                >
                                    <Image
                                        src={e.productId.productImageUrl[0]}
                                        alt={e.productId.productTitle}
                                        width={160}
                                        height={110}
                                        className="rounded-[20px] object-cover"
                                    />
                                    <div className="flex-1">
                                        <h6 className="text-[16px] tracking-[0.04em] text-[#3C3C3C]">
                                            {e.productId.productTitle}
                                        </h6>
                                        <p className="text-[16px] tracking-[0.04em] text-[#3C3C3C] pb-[8px]">
                                            ₹ {e.productId.salePrice}.00
                                        </p>

                                        <div className="flex justify-between items-center w-full">
                                            <button
                                                onClick={() => handleUpdateCart(e.productId._id)}
                                                className="bg-[#BA7E38] rounded-[22px] py-[5px] px-[18px] text-white"
                                            >
                                                Remove
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setCartData((prev) =>
                                                            prev.map((item) =>
                                                                item.productId._id === e.productId._id
                                                                    ? {
                                                                        ...item,
                                                                        quantity: Math.max(item.quantity - 1, 1),
                                                                    }
                                                                    : item
                                                            )
                                                        )
                                                    }
                                                    className="bg-[#12121226] h-[28px] w-[28px] rounded-full flex items-center justify-center text-lg"
                                                >
                                                    -
                                                </button>

                                                <p className="text-[16px]">{e.quantity}</p>

                                                <button
                                                    onClick={() =>
                                                        setCartData((prev) =>
                                                            prev.map((item) =>
                                                                item.productId._id === e.productId._id
                                                                    ? { ...item, quantity: item.quantity + 1 }
                                                                    : item
                                                            )
                                                        )
                                                    }
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

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[380px] bg-white p-6 rounded-[20px] shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                        <div className="flex justify-between mb-3">
                            <p className="text-[#3C3C3C]">Subtotal</p>
                            <p className="font-semibold">₹ {subtotal}.00</p>
                        </div>

                        <div className="flex justify-between mb-3">
                            <p className="text-[#3C3C3C]">Shipping</p>
                            <p className="font-semibold">₹ {shipping}.00</p>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between mb-6">
                            <p className="text-lg font-semibold">Total</p>
                            <p className="text-lg font-semibold">₹ {total}.00</p>
                        </div>

                        <button className="w-full bg-[#BA7E38] text-white py-3 rounded-[20px] text-lg font-semibold hover:bg-[#a96f2e] transition">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
