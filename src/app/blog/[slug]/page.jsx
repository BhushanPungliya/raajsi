"use client";

import Image from "next/image";
import { useState, useEffect, useRef, use } from "react";
import { getBlogBySlug } from "@/api/auth";

export default function BlogDetail({ params }) {
    const { slug } = use(params);
    const nextSectionRef = useRef(null);

    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const [openModal1, setOpenModal1] = useState(false)
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogBySlug(slug);
                console.log("Blog fetch response:", response);
                if (response?.status === "success") {
                    setBlog(response?.data?.blog);
                } else {
                    setError("Blog not found");
                }
            } catch (err) {
                console.error("Error fetching blog:", err);
                setError("Failed to load blog");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading blog...</div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="text-center py-20 text-red-500">
                {error || "Blog not found"}
            </div>
        );
    }

    return (
        <div>
            <section
                className="hero-section h-[778px] overflow-hidden"
                style={{
                    backgroundImage: "url('/images/home/bg1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
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
                    <h2 className='font-rose text-[32px] text-[#FFFFFF] py-[20px]'>Blog Detail</h2>
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
            <article ref={nextSectionRef} className="max-w-4xl mx-auto px-4 py-12">
                {/* Image */}
                <img
                    src={blog.displayImage?.[0]?.url || "/images/home/img5.png"}
                    alt={blog.title}
                    className="w-full h-[400px] object-cover rounded-xl shadow-md"
                />

                {/* Title */}
                <h1 className="text-4xl font-bold mt-6 mb-2">{blog.title}</h1>

                {/* Date */}
                <div className="text-gray-500 mb-6">
                    {new Date(blog.createdAt).toLocaleDateString()}
                </div>

                {/* Content */}
                <div
                    className="prose max-w-none text-justify"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
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
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                            यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</p>
                        <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            )}
        </div>
    );
}