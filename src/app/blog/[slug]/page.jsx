"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getBlogBySlug } from "@/api/auth";

export default function BlogDetail({ params }) {
    const { slug } = params;
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
            <section className="hero-section h-[778px] overflow-hidden">
                <div className="relative w-full h-full lg:pl-[93px] pl-[20px] pt-[83px]">
                    <h2 className='font-rose text-[32px] text-[#FFFFFF] pb-[20px]'>Blog Detail</h2>
                    <button className="absolute bottom-[128px] left-[50%] -translate-x-1/2 ">
                        <Image src="/images/home/arrow.svg" height={42} width={42} className="arrow-bounce" alt="" />
                    </button>
                </div>
            </section>
            <article className="max-w-4xl mx-auto px-4 py-12">
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
        </div>
    );
}