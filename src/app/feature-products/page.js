"use client";
import Image from 'next/image'
import React, { useEffect, useRef, useState } from "react";
import Heading from '../components/Heading'
import TestSlider from '../slider/TestSlider'
import Link from 'next/link'
import { getAllProducts } from '@/api/auth'
import WishlistButton from '../components/WishlistButton';
import CartButton from '../components/CartButton';

// export const featureProducts = [
//     {
//         id: 1,
//         name: "Cosmic Body Oil",
//         desc: "Unlock celestial beauty in a bottle. A careful blend of essential oils and natural ingredients that melt into your skin, leaving you nourished and calm.",
//         image: "/images/home/img3.jpg",
//         logo: "/images/home/lag.svg",
//         price: "₹1800",
//         oldPrice: "₹2400",
//         discount: "Get 50% OFF",
//     },
//     {
//         id: 2,
//         name: "Ayurvedic Face Cream",
//         desc: "Infused with saffron and sandalwood, this cream brightens, hydrates, and rejuvenates your skin for a natural glow.",
//         image: "/images/home/img8.jpg",
//         logo: "/images/home/lag.svg",
//         price: "₹950",
//         oldPrice: "₹1200",
//         discount: "Get 20% OFF",
//     },
//     {
//         id: 3,
//         name: "Herbal Hair Elixir",
//         desc: "A nourishing blend of bhringraj, amla, and neem that strengthens roots, prevents hair fall, and adds shine.",
//         image: "/images/home/img3.jpg",
//         logo: "/images/home/lag.svg",
//         price: "₹1250",
//         oldPrice: "₹1600",
//         discount: "Get 22% OFF",
//     },
//     {
//         id: 4,
//         name: "Organic Rose Water",
//         desc: "Pure steam-distilled rose water that tones, refreshes, and hydrates your skin naturally.",
//         image: "/images/home/img8.jpg",
//         logo: "/images/home/lag.svg",
//         price: "₹450",
//         oldPrice: "₹600",
//         discount: "Get 25% OFF",
//     },
// ];


function Page() {
    const nextSectionRef = useRef(null);

    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const [openModal, setOpenModal] = useState(false);
    const [benefits, setBenefits] = useState(false)
    const [openModal1, setOpenModal1] = useState(false)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();

                const { categories, products } = separateCategories(
                    data?.data?.products || []
                );
                console.log("Products:", products);
                console.log("Categories:", categories);
                setProducts(products);
                setCategories(categories);
            } catch (err) {
                console.error("Error fetching featured products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    function separateCategories(products) {
        const categoriesMap = new Map();

        const updatedProducts = products.map((product) => {
            const { category, ...rest } = product;

            if (category && !categoriesMap.has(category._id)) {
                categoriesMap.set(category._id, {
                    _id: category._id,
                    name: category.name,
                });
            }

            return {
                ...rest,
                categoryId: category?._id || null,
            };
        });

        const categories = Array.from(categoriesMap.values());
        return { categories, products: updatedProducts };
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-[#BA7E38] text-[24px] font-bold animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }
    return (
        <div>
            <section className="hero-section h-[600px] sm:h-[650px] md:h-[700px] lg:h-[778px] overflow-hidden">
                <div className="relative w-full h-full lg:pl-[93px] pl-[20px] pt-[50px] sm:pt-[60px] md:pt-[70px] lg:pt-[83px]">
                    <div className="relative max-w-[474px] w-full">
                        <h2 className="max-w-[90%] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[634px] 
                   w-full font-[400] text-[24px] sm:text-[28px] md:text-[34px] lg:text-[41px] 
                   text-[#FFFAFA] leading-[30px] sm:leading-[36px] md:leading-[40px] lg:leading-[40px]">
                            शरीरमाद्यं खलु धर्मसाधनम्।
                        </h2>
                        <button className="absolute lg:bottom-0 bottom-[0px] lg:right-[-20px] right-[20px]" onClick={() => setOpenModal1(true)}>
                            <Image
                                src="/images/home/lag.svg"
                                height={40}
                                width={40}
                                alt="le"
                            />
                        </button>
                    </div>
                    <p className="font-avenir-400 text-[20px] lg:text-[18px] 
                  text-[#FFFFFF] uppercase max-w-[100%] lg:max-w-[671px] 
                  w-full leading-[28px] lg:leading-[26px] 
                  pt-[12px] sm:pt-[14px] md:pt-[16px] lg:pt-[18px]">
                        Explore our wide range of luxurious skincare and wellness products to celebrate beauty that is timeless.
                    </p>
                    <button onClick={handleScroll} className="absolute bottom-[90px] cursor-pointer sm:bottom-[110px] md:bottom-[120px] lg:bottom-[128px] left-1/2 -translate-x-1/2">
                        <Image
                            src="/images/home/arrow.svg"
                            height={36}
                            width={36}
                            className="arrow-bounce"
                            alt="scroll arrow"
                        />
                    </button>
                </div>
            </section>
            <div ref={nextSectionRef}>
                {categories.map((cat, idx) => (
                    <section key={cat._id} className='lg:py-[62px] py-[30px] lg:bg-transparent bg-[#BA7E381A]'>
                        <div className="max-w-[1440px] w-full mx-auto lg:px-[34px] px-[20px]">
                            <Heading title={cat.name.toUpperCase()} />
                            {/* Optional: category description, you can customize per category */}
                            <p className="max-w-[360px] mx-auto pt-[14px] pb-[26px] text-center text-gradient font-[400] lg:text-[24px] text-[14px] w-full ">
                                {/* Add your Sanskrit or Hindi description here if needed */}
                            </p>
                            <div className="max-w-[1369px] w-full mx-auto lg:bg-[#BA7E381A] bg-transparent rounded-[24px] lg:p-[32px]">
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-[30px]">
                                    {products.filter(p => p.categoryId === cat._id).map((product) => (
                                        <div key={product._id} className="w-full max-w-[634px]">
                                            <div className="relative rounded-[20px] h-[250px] md:h-[433px] overflow-hidden">
                                                <Image
                                                    src={product.productImageUrl?.[0] || "/images/home/img3.jpg"}
                                                    alt={product.productTitle}
                                                    fill
                                                    className="rounded-[20px] object-cover"
                                                />
                                                <div
                                                    className="absolute bottom-0 left-0 w-full h-[120px] md:h-[206px]"
                                                    style={{
                                                        background:
                                                            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                                                    }}
                                                ></div>
                                                {/* Top overlay */}
                                                <div className="absolute top-0 w-full z-10 p-[15px] md:p-[30px]">
                                                    <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] md:flex-row flex-col">
                                                        <div className="flex items-center gap-[10px] md:gap-[14px]">
                                                            <button onClick={() => setOpenModal(true)}>
                                                                <Image
                                                                    src="/images/home/lag.svg"
                                                                    height={30}
                                                                    width={30}
                                                                    alt="le"
                                                                />
                                                            </button>
                                                            <h6 className="font-avenir-400 text-[10px] md:text-[12px] text-[#363636] max-w-[200px]">
                                                                {/* Optional Sanskrit text */}
                                                            </h6>
                                                        </div>
                                                        <button onClick={() => setBenefits(true)} className="bg-[#3030304A] font-avenir-400 text-[12px] md:text-[14px] text-[#FFFFFF] py-[6px] px-[14px] md:py-[10px] md:px-[22px] rounded-full">
                                                            Ingredients & Benefits
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Bottom overlay */}
                                                <div className="absolute bottom-0 w-full z-10 p-[15px] md:p-[30px]">
                                                    <h6 className="font-rose font-[400] text-[18px] md:text-[32px] text-[#FFFFFF] pb-[6px]">
                                                        {product.productTitle}
                                                    </h6>
                                                    <p className="font-avenir-400 text-[12px] md:text-[20px] text-[#FFFFFF]">
                                                        {product.productDescription}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Bottom actions */}
                                            <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] flex-row py-[18px]">
                                                <div className="flex gap-[6px] md:flex-row flex-col items-start w-full">
                                                    <Link href={`/products/${product._id}`} className="w-full md:w-auto">
                                                        <button className="font-avenir-400 cursor-pointer w-full md:max-w-[206px] text-[12px] md:text-[18px] text-[#FFFFFF] py-[8px] md:py-[12px] px-[10px] md:px-[30px] bg-[#BA7E38] rounded-full border border-[#BA7E38] hover:bg-transparent hover:text-[#BA7E38] transition-all">
                                                            VIEW PRODUCT
                                                        </button>
                                                    </Link>
                                                    <div className="flex gap-[10px]">
                                                        <CartButton productId={product._id} />
                                                        <WishlistButton productId={product._id} />
                                                    </div>
                                                </div>
                                                <div className="text-right w-full md:max-w-[170px]">
                                                    <h6 className="font-avenir-800 text-[20px] md:text-[24px] text-[#000000]">
                                                        ₹{product?.salePrice}
                                                    </h6>
                                                    {product?.regularPrice > product?.salePrice && (
                                                        <p className="font-avenir-400 text-[14px] md:text-[18px] text-[#00000099]">
                                                            Get{" "}
                                                            {Math.round(
                                                                ((product?.regularPrice - product?.salePrice) / product?.regularPrice) * 100
                                                            )}
                                                            % OFF &nbsp;
                                                            <span className="line-through">₹{product?.regularPrice}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
            <section className='lg:pt-[100px] pt-[60px]'>
                <div className="max-w-[1440px] w-full mx-auto lg:px-[34px] px-[20px]">
                    <Heading title="Testimonials" />
                    <p className="pt-[6px] pb-[44px] text-center text-[#5E6E89] font-avenir-400 text-[18px] leading-[27.6px] ">Some quotes from our happy customers</p>
                    <div className='overflow-hidden'>
                        <TestSlider />
                        {/* <div style={{ boxShadow: "0px 4px 24px 0px #8BA7B229" }} className='bg-[#FFFFFF] rounded-[6px] py-[22px] px-[16px]'>
                            <div className='relative pt-[16px]'>
                                <h6 className="text-[32px] absolute top-[0px] leading-[28.8px]">“</h6>
                                <h6 className="text-[32px] absolute bottom-[0px] right-[30px] leading-[28.8px]">”</h6>
                                <p className="font-[400] font-avenir-400 text-[22px] leading-[28px] text-[#101418]">I love this Vitamin C serum, I can see my skin becomes brighter after one to two days only which is remarkable.</p>
                            </div>
                            <div className="flex items-center gap-[12px] pt-[20px] pb-[30px]">
                                <div className="bg-[#D9D9D9] h-[50px] w-[50px] rounded-full"></div>
                                <p className="font-avenir-400 text-[18px] text-[#7C8087]">– Luisa</p>
                            </div>
                            <div className="flex gap-[6px] items-center pb-[14px]">
                                <Image src="/images/footer/star.svg" height={24} width={24} alt='star' />
                                <Image src="/images/footer/star.svg" height={24} width={24} alt='star' />
                                <Image src="/images/footer/star.svg" height={24} width={24} alt='star' />
                                <Image src="/images/footer/star.svg" height={24} width={24} alt='star' />
                                <Image src="/images/footer/star.svg" height={24} width={24} alt='star' />
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>
            {openModal && (
                <div
                    className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
                    onClick={() => setOpenModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md py-[30px] px-[34px] relative"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="authModalTitle"
                    >
                        <button className="auth-close-btn" onClick={() => setOpenModal(false)} aria-label="Close login">&times;</button>
                        <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] pb-[10px]">Shlok Meaning</h6>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-center text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                            यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</p>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            )}
            {openModal1 && (
                <div
                    className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
                    onClick={() => setOpenModal1(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md py-[30px] px-[34px] relative"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="authModalTitle"
                    >
                        <button className="auth-close-btn" onClick={() => setOpenModal1(false)} aria-label="Close login">&times;</button>
                        <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] pb-[10px]">Shlok Meaning</h6>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-center text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                            यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</p>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            )}
            {benefits && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setBenefits(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md py-[30px] px-[34px] relative"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="authModalTitle"
                    >
                        <button className="auth-close-btn" onClick={() => setBenefits(false)} aria-label="Close login">&times;</button>
                        <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] pb-[10px]">Ingredients</h6>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-center text-[#3C3C3C] max-w-[260px] pb-[10px] w-full mx-auto">Cosmic Body Oil</p>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page
