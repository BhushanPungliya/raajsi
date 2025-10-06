import Image from "next/image";

const blogs = [
    {
        imgs: "/images/home/img5.png",
        slug: "natural-ingredients-connect",
        title: "How to Use Next.js for Your Blog",
        author: "Gautam Parmar",
        date: "2025-09-30",
        content: `
      <p>Next.js ek powerful React framework hai jo SEO-friendly blogs banane ke liye perfect hai. 
      Isme aapko SSR, SSG aur API routes jaise advanced features milte hain.</p>
    `
    },
    {
        imgs: "/images/home/img6.png",
        slug: "tailwind-css-tips",
        title: "Top 10 Tailwind CSS Tips",
        author: "John Doe",
        date: "2025-09-25",
        content: `
      <p>Tailwind CSS styling ko super fast aur scalable banata hai. 
      Responsive classes aur typography plugin ka use karke aap UI ko aur enhance kar sakte ho.</p>
    `
    },
    {
        imgs: "/images/home/img7.png",
        slug: "react-in-2025",
        title: "Why Learn React in 2025?",
        author: "Jane Smith",
        date: "2025-09-20",
        content: `
      <p>React abhi bhi frontend development ka king hai. 
      Hooks, Context API aur ecosystem libraries ke saath aap complex apps easily bana sakte ho.</p>
    `
    }]

export default function BlogDetail({ params }) {
    const { slug } = params;
    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
        return <div className="text-center py-20 text-red-500">Blog not found</div>;
    }

    return (
        <div>
            <section className="hero-section h-[778px] overflow-hidden">
                <div className="relative w-full h-full lg:ml-[93px] ml-[20px] pt-[83px]">
                    <h2 className='font-rose text-[32px] text-[#FFFFFF] pb-[20px]'>Blog Detail</h2>
                    {/* <h2 className="max-w-[634px] w-full font-[400] lg:text-[41px] text-[26px] text-[#FFFAFA] ">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                                यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</h2> */}
                    <button className="absolute bottom-[128px] left-[50%] -translate-x-1/2 ">
                        <Image src="/images/home/arrow.svg" height={42} width={42} className="arrow-bounce" alt="" />
                    </button>
                </div>
            </section>
            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Image */}
                <img
                    src="/images/home/img5.png"
                    alt={blog.title}
                    className="w-full h-[400px] object-cover rounded-xl shadow-md"
                />

                {/* Title */}
                <h1 className="text-4xl font-bold mt-6 mb-2">{blog.title}</h1>

                {/* Author & Date */}
                <div className="text-gray-500 mb-6">
                    By <span className="font-medium">{blog.author}</span> |{" "}
                    {new Date(blog.date).toLocaleDateString()}
                </div>

                {/* Content */}
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </div>
    );
}
