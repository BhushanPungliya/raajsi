"use client";

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Heading from '../components/Heading'
import Link from 'next/link';
import { getAllBlogs } from '@/api/auth';

function Page() {
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
                    <h2 className='font-rose text-[32px] text-[#FFFFFF] pb-[20px]'>Blog</h2>
                    {/* <h2 className="max-w-[634px] w-full font-[400] lg:text-[41px] text-[26px] text-[#FFFAFA] ">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                        यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</h2> */}
                    <button className="absolute bottom-[128px] left-[50%] -translate-x-1/2 ">
                        <Image src="/images/home/arrow.svg" height={42} width={42} className="arrow-bounce" alt="" />
                    </button>
                </div>
            </section>
            <section className='py-[66px] overflow-hidden'>
                <div className="max-w-[1440px] w-full mx-auto lg:px-[54px] px-[20px]">
                    <Heading title="Blogs" />
                    <div className="pt-[73px] max-w-[1440px] w-full mx-auto px-[20px]">
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-[20px]">
                            {blogs?.map((blog, i) => {
                                return (
                                    <div key={blog._id || i} className="w-full rounded-[24px] bg-[#FFFFFF]">
                                        <Image 
                                            src={blog?.displayImage?.[0]?.url || "/images/home/img5.png"} 
                                            height={219} 
                                            width={390} 
                                            alt="blog-img" 
                                            className="rounded-t-[24px] w-full h-[219px] object-cover" 
                                        />
                                        <div className="px-[30px] py-[18px]">
                                            <h6 className="font-avenir-400 text-[20px] text-[#000000] pb-[10px]">{blog.title}</h6>
                                            <div className="flex justify-between items-center pb-[16px]">
                                                <p className="font-avenir-400 text-[18px] text-[#6C757D]">
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </p>
                                                <div className="flex gap-[10px] items-center">
                                                    <Image alt="share" height={16} width={16} src="/images/home/share.svg" />
                                                    <p className="font-avenir-400 text-[18px] text-[#6C757D]">1K shares</p>
                                                </div>
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
        </div>
    )
}

export default Page
