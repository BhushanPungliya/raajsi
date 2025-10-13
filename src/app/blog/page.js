"use client";

import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import Heading from '../components/Heading'
import Link from 'next/link';
import { getAllBlogs } from '@/api/auth';

function Page() {
    const nextSectionRef = useRef(null);

    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const [openModal1, setOpenModal1] = useState(false)
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getAllBlogs();
                if (response?.status === "success") {
                    setBlogs(response?.data?.blogs || []);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading blogs...</div>
            </div>
        );
    }

    return (
        <div>
            <section className="hero-section h-[778px] overflow-hidden">
                <div className="relative w-full h-full lg:pl-[93px] pl-[20px] pt-[83px]">
                    <div className="relative max-w-[474px] w-full">
                        <h2 className="max-w-[90%] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[634px] 
                                   w-full font-[400] text-[24px] sm:text-[28px] md:text-[34px] lg:text-[41px] 
                                   text-[#FFFAFA] leading-[30px] sm:leading-[36px] md:leading-[40px] lg:leading-[40px]">
                            शरीरमाद्यं खलु धर्मसाधनम्।
                        </h2>
                        <button className="absolute lg:bottom-0 bottom-[0px] lg:right-[-20px]" onClick={() => setOpenModal1(true)}>
                            <Image
                                src="/images/home/lag.svg"
                                height={40}
                                width={40}
                                alt="le"
                            />
                        </button>
                    </div>
                    <h2 className='font-rose text-[32px] text-[#FFFFFF] py-[20px]'>Blog</h2>
                    {/* <h2 className="max-w-[634px] w-full font-[400] lg:text-[41px] text-[26px] text-[#FFFAFA] ">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                        यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</h2> */}
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
            <section ref={nextSectionRef} className='py-[66px] overflow-hidden'>
                <div className="max-w-[1440px] w-full mx-auto lg:px-[54px] px-[20px]">
                    <Heading title="Blogs" />
                    <div className="pt-[73px] max-w-[1440px] w-full mx-auto px-[20px]">
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-[20px]">
                            {blogs?.map((blog, i) => {
                                return (
                                    <div key={blog._id || i} className="w-full rounded-[24px] bg-[#FFFFFF]">
                                    <Link  href={`/blog/${blog.slug}`}>
                                        <Image
                                            src={blog?.displayImage?.[0]?.url || "/images/home/img5.png"}
                                            height={219}
                                            width={390}
                                            alt="blog-img"
                                            className="rounded-t-[24px] w-full h-[219px] object-cover"
                                        />
                                    </Link>
                                        <div className="px-[30px] py-[18px]" >
                                            <Link href={`/blog/${blog.slug}`}>
                                                <h6 className="font-avenir-400 text-[20px] text-[#000000] pb-[10px]">{blog.title}</h6>
                                            </Link>
                                            <div className="flex justify-between items-center pb-[16px]">
                                                <p className="font-avenir-400 text-[18px] text-[#6C757D]">
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </p>
                                                {/* <div className="flex gap-[10px] items-center">
                                                    <Image alt="share" height={16} width={16} src="/images/home/share.svg" />
                                                    <p className="font-avenir-400 text-[18px] text-[#6C757D]">1K shares</p>
                                                </div> */}
                                            </div>
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="font-avenir-400 text-[20px] underline text-[#000000] hover:text-[#ED6800] transition"
                                            >
                                                Read Blog
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {blogs.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No blogs available at the moment.</p>
                            </div>
                        )}
                        {/* <div className="flex justify-center pt-[30px]">
                            <button className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">VIEW ALL </button>
                        </div> */}
                    </div>
                </div>
            </section>
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
        </div>
    )
}

export default Page
