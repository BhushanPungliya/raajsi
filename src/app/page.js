"use client"; // agar aap app router (app dir) use kar rahe ho to ye add karna hoga
import Image from "next/image";
import Heading from "./components/Heading";
import React, { useEffect, useRef, useState } from "react";
import FeatureSlider from "./slider/FeatureSlider";
import Slider1 from "./slider/Slider1";
import Link from "next/link";
import RitualSlider from "./slider/RitualSlider";
import BlogSlider from "./slider/BlogSlider";
import { getAllProducts, getFaqs, getFeaturedProducts, getAllBlogs } from "@/api/auth";

// const featureData = ["BODY THERAPY ", "SKIN THERAPY ", "SKIN THERAPY ", "RITUAL KIT"]
// const blogs = [
//   { imgs: "/images/home/img5.png" },
//   { imgs: "/images/home/img6.png" },
//   { imgs: "/images/home/img7.png" },
// ]

const faq = [
  { fTitle: "Is Raajsi for me?", fText: "Raajsi is crafted for individuals who seek luxury without compromise. If you value natural ingredients, ethical sourcing, and holistic wellness, Raajsi products are made for you." },
  { fTitle: "Is Raajsi safe?", fText: "Raajsi is crafted for individuals who seek luxury without compromise. If you value natural ingredients, ethical sourcing, and holistic wellness, Raajsi products are made for you." },
  { fTitle: "Do you offer free shipping?", fText: "Raajsi is crafted for individuals who seek luxury without compromise. If you value natural ingredients, ethical sourcing, and holistic wellness, Raajsi products are made for you." },
  { fTitle: "Where do you ship?", fText: "Raajsi is crafted for individuals who seek luxury without compromise. If you value natural ingredients, ethical sourcing, and holistic wellness, Raajsi products are made for you." },
  { fTitle: "How long does delivery take?", fText: "Raajsi is crafted for individuals who seek luxury without compromise. If you value natural ingredients, ethical sourcing, and holistic wellness, Raajsi products are made for you." },
  { fTitle: "What if Raajsi doesn't work for me?", fText: "Raajsi is crafted for individuals who seek luxury without compromise. If you value natural ingredients, ethical sourcing, and holistic wellness, Raajsi products are made for you." },
]

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [openModal, setOpenModal] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null);
  const [featureData, setFeatureData] = useState([]);
  // const [faqs, setFaqs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const nextSectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log("Featured Products:", data);
        setFeatureData(data?.data?.products)
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    // const fetchFaqs = async () => {
    //   try {
    //     const data = await getFaqs();
    //     console.log("Featured Products:", data);
    //     setFaqs(data?.data?.FAQs)
    //   } catch (err) {
    //     console.error("Error fetching featured products:", err);
    //   }
    // };
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        if (data?.status === "success") {
          // Get only the 3 most recent blogs
          const recentBlogs = data?.data?.blogs?.slice(0, 3) || [];
          setBlogs(recentBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchProducts();
    // fetchFaqs();
    fetchBlogs();
  }, []);

  const scrollToNext = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <section className="hero-section h-[600px] sm:h-[650px] md:h-[700px] lg:h-[778px]">
        <div className="relative w-full h-full flex flex-col">
          <div className="relative max-w-[90%] lg:max-w-[734px]">
            <h2
              className="
        font-[400] 
        text-[18px] md:text-[36px] lg:text-[41px] 
        leading-[30px] sm:leading-[38px] max-w-[90%] lg:max-w-[634px] md:leading-[48px] lg:leading-[56px]
        text-[#FFFAFA] 
        ml-[20px] lg:ml-[93px] lg:mr-0
        pt-[40px] sm:pt-[60px] md:pt-[70px] lg:pt-[83px]
      "
            >
              मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
              यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥
            </h2>
            <button className="pb-[14px] absolute lg:bottom-0 lg:pl- pl-[20px] bottom-[-60px] lg:right-[-20px]" onClick={() => setOpenModal(true)}>
              <Image
                src="/images/home/lag.svg"
                height={40}
                width={40}
                alt="le"
              />
            </button>
          </div>

          {/* Arrow Button */}
          <button
            onClick={scrollToNext}
            className="
        absolute 
        bottom-[60px] sm:bottom-[90px] md:bottom-[110px] lg:bottom-[128px] 
        left-1/2 -translate-x-1/2
      "
          >
            <Image
              src="/images/home/arrow.svg"
              height={36}
              width={36}
              className="arrow-bounce sm:h-[40px] sm:w-[40px] md:h-[42px] md:w-[42px]"
              alt="scroll arrow"
            />
          </button>
        </div>
      </section>
      <section ref={nextSectionRef} className="py-[50px] lg:py-[62px] overflow-hidden">
        <div className="flex items-center flex-col-reverse lg:flex-row lg:gap-[96px] gap-[50px]">

          {/* Image Section */}
          <div className="relative w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[787px] h-auto">
            <Image
              src="/images/home/img1.png"
              alt="Hero"
              width={787}
              height={611}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="px-[20px] sm:px-[40px] lg:px-0">
            <h6 className="font-rose font-[400] pb-[10px] lg:pb-[30px] 
        text-[22px] sm:text-[26px] md:text-[28px] lg:text-[32px] text-[#4C0A2E]">
              Our Essence
            </h6>

            <p className="w-full max-w-[100%] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[390px] 
        pb-[10px] lg:pb-[20px] 
        text-gradient font-[400] 
        text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-relaxed">
              मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
              यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥
            </p>

            <p className="w-full max-w-[100%] sm:max-w-[380px] md:max-w-[400px] lg:max-w-[415px] 
        text-[#000000] font-[400] capitalize 
        text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] 
        leading-[22px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] 
        pb-[25px] sm:pb-[30px] lg:pb-[40px]">
              Raajsi is a premium ayurvedic beauty and wellness brand with a royal touch.
              <br />
              Combining elements of regal rituals and ayurveda, we invite you to immerse yourself in the scents, texture and colours of our heritage.
            </p>

            <Link href="/our-essence" className="font-avenir-400 text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] 
        text-white py-[14px] sm:py-[16px] md:py-[18px] lg:py-[20px] 
        px-[24px] sm:px-[28px] md:px-[32px] lg:px-[34px] 
        bg-[#BA7E38] rounded-full border border-[#BA7E38] 
        transition-all duration-300 hover:bg-transparent hover:text-[#BA7E38]">
              EXPLORE ESSENCE
            </Link>
          </div>
          {openModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
                <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                  यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</p>
                <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="step-section pb-[40px] overflow-hidden">
        <div className="lg:pt-[60px] pt-[46px] max-w-[1205px] w-full mx-auto ">
          <Heading title="Step into royal indulgence." />
          <div className="pt-[54px] relative lg:block hidden">
            <div className="rounded-t-[24px] overflow-hidden bg-[#FEFEFE] lg:px-[100px] px-[16px] pt-[50px] flex justify-between lg:flex-row flex-col">
              <div className="max-w-[538px] w-full lg:pb-[214px] pb-[30px]">
                <h6 className="font-rose font-[400] lg:text-[24px] text-[16px] lg:text-left text-center tracking-[4%] text-[#4C0A2E] pb-[14px]">From Palace to You: A Body Ritual</h6>
                <p className="font-avenir-400 text-[16px] text-[#0C0C0C] lg:text-left text-center pb-[24px]">Rani Padmavati of Chittor indulged in luxurious ubtan rituals
                  —an age-old body remedy made with sandalwood, turmeric, lentils, and rose petals. Applied before her ceremonial baths, this exfoliating paste, followed by herbal oil massages, wasn’t just for beauty—it was a sacred act of self-rejuvenation. At Raajsi, we revive this royal tradition through our body oils, scrubs, and soaps, bringing timeless radiance to your modern-day rituals</p>
                <p className="font-avenir-400 text-[20px] text-[#727272] lg:text-left text-center pb-[45px]">Step into royal indulgence.</p>
                <Link href="/feature-products" className="flex items-start items-center">
                  <button className="font-avenir-400 text-[18px] rounded-full text-[#FFFFFF] py-[14px] px-[24px] bg-[#4C0A2E] border border-[#4C0A2E] an hover:bg-transparent hover:text-[#4C0A2E]">VIEW PRODUCTS</button>
                </Link>
              </div>
              <div className="max-w-[335px] h-[380px] w-full">
                <Image
                  src="/images/home/img2.png"
                  alt="Hero"
                  height={380} width={335}
                  className="object-cover rounded-t-full"
                />
              </div>
            </div>
            <div className="rounded-t-[24px] group lg:h-[100px] h-auto hover:h-[444px] an lg:mt-[-20px] lg:absolute relative w-full lg:bottom-[70px] z-10 overflow-hidden bg-[#BA7E38] lg:px-[100px] px-[20px] hover:pt-[50px] pt-[20px] flex justify-between lg:flex-row flex-col">
              <div className="max-w-[538px] w-full pb-[44px]">
                <h6 className="font-rose font-[400] text-[24px] tracking-[4%] text-[#FFFFFF] pb-[14px]">Radiance of the Rajput Ranis-Skin Alchemy</h6>
                <p className="font-avenir-400 text-[16px] text-[#FFFFFF] pb-[24px]">Rani Karnavati of Mewar was known for her disciplined beauty rituals, which were drawn from Ayurveda. Her skincare secrets included cooling aloe vera gels, sandalwood pastes, and saffron mixed with raw milk—applied daily to protect her skin from the harsh desert sun. These remedies not only nourished the skin but symbolised a deeper connection to purity and grace. Raajsi’s creams and cleansers echo these regal traditions—infusing ancient wisdom into every drop.</p>
                <p className="font-avenir-400 text-[20px] text-[#FFFFFF] pb-[45px]">Glow like royalty.</p>
                <Link href="/feature-products"><button className="font-avenir-400 text-[18px] rounded-full text-[#4C0A2E] py-[14px] px-[24px] bg-[#FFFFFF] border border-[#FFFFFF] an hover:bg-transparent hover:text-[#FFFFFF]">VIEW PRODUCTS</button></Link>
              </div>
              <div className="max-w-[335px] lg:opacity-0 an group-hover:opacity-100 h-[380px] w-full">
                <Image
                  src="/images/home/img2.png"
                  alt="Hero"
                  height={380} width={335}
                  className="object-cover rounded-t-full"
                />
              </div>
            </div>
            <div className="rounded-t-[24px] group lg:h-[100px] h-auto hover:h-[444px] an lg:mt-[-20px] lg:absolute relative w-full lg:bottom-[0px] z-20 overflow-hidden bg-[#4C0A2E] lg:px-[100px] px-[14px] hover:pt-[50px] pt-[20px] flex justify-between lg:flex-row flex-col">
              <div className="max-w-[538px] w-full pb-[44px]">
                <h6 className="font-rose font-[400] text-[24px] tracking-[4%] text-[#FFFFFF] pb-[14px]">Hair Elixirs Tresses of Tradition</h6>
                <p className="font-avenir-400 text-[16px] text-[#FFFFFF] pb-[24px]">Rani Karnavati of Mewar was known for her disciplined beauty rituals, which were drawn from Ayurveda. Her skincare secrets included cooling aloe vera gels, sandalwood pastes, and saffron mixed with raw milk—applied daily to protect her skin from the harsh desert sun. These remedies not only nourished the skin but symbolised a deeper connection to purity and grace. Raajsi’s creams and cleansers echo these regal traditions—infusing ancient wisdom into every drop.
                </p>
                <p className="font-avenir-400 text-[20px] text-[#FFFFFF] pb-[45px]">Glow like royalty.</p>
                <button className="font-avenir-400 text-[18px] rounded-full text-[#4C0A2E] py-[14px] px-[24px] bg-[#FFFFFF] border border-[#FFFFFF] an hover:bg-transparent hover:text-[#FFFFFF]">VIEW PRODUCTS</button>
              </div>
              <div className="max-w-[335px] lg:opacity-0 an group-hover:opacity-100 h-[380px] w-full">
                <Image
                  src="/images/home/img2.png"
                  alt="Hero"
                  height={380} width={335}
                  className="object-cover rounded-t-full"
                />
              </div>
            </div>
            <div className="rounded-t-[24px] group lg:h-[70px] h-auto hover:h-[444px] an lg:mt-[-20px] lg:absolute relative w-full lg:bottom-[-40px] z-30 overflow-hidden bg-[#6A5013] lg:px-[100px] px-[14px] pt-[20px] hover:pt-[50px] flex justify-between lg:flex-row flex-col">
              <div className="max-w-[538px] w-full pb-[44px]">
                <h6 className="font-rose font-[400] text-[24px] tracking-[4%] text-[#FFFFFF] pb-[14px]">Ritual Kits Anointing Grace</h6>
                <p className="font-avenir-400 text-[16px] text-[#FFFFFF] pb-[24px]">Rani Padmavati of Chittor indulged in luxurious ubtan rituals
                  —an age-old body remedy made with sandalwood, turmeric, lentils, and rose petals. Applied before her ceremonial baths, this exfoliating paste, followed by herbal oil massages, wasn’t just for beauty—it was a sacred act of self-rejuvenation. At Raajsi, we revive this royal tradition through our body oils, scrubs, and soaps, bringing timeless radiance to your modern-day rituals</p>
                <p className="font-avenir-400 text-[20px] text-[#FFFFFF] pb-[45px]">Step into royal indulgence.</p>
                <button className="font-avenir-400 text-[18px] rounded-full text-[#4C0A2E] py-[14px] px-[24px] bg-[#FFFFFF] border border-[#FFFFFF] an hover:bg-transparent hover:text-[#FFFFFF]">VIEW PRODUCTS</button>
              </div>
              <div className="max-w-[335px] lg:opacity-0 an group-hover:opacity-100 h-[380px] w-full">
                <Image
                  src="/images/home/img2.png"
                  alt="Hero"
                  height={380} width={335}
                  className="object-cover rounded-t-full"
                />
              </div>
            </div>
          </div>
          <div className="lg:hidden pt-[54px] ritual-slider block">
            <RitualSlider />
          </div>
        </div>
      </section>
      <section className="pt-[70px] lg:pb-[125px] pb-[60px]">
        <Heading title="Featured products" />
        <div className="flex max-w-[1440px] w-full mx-auto lg:justify-center justify-start items-center pt-[40px] mb-[40px] pb-[10px] overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap gap-[16px] px-[10px] whitespace-nowrap">
            {featureData?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelected(index)}
                className={`lg:py-[14px] py-[10px] lg:px-[30px] px-[20px] rounded-full font-avenir-400 lg:text-[18px] text-[14px] transition-all duration-300
          ${selected === index
                    ? "bg-[#BA7E38] text-white"
                    : "bg-[#FFFFFF] text-[#333]"
                  }`}
              >
                {item?.productTitle}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:px-[50px] px-[20px] max-w-[1440px] w-full mx-auto overflow-hidden">
          <FeatureSlider featureData={featureData} />
        </div>
      </section>
      <section className="lg:pb-[100px] pb-[0px]">
        <div className="overflow-hidden the-royal-slider relative">
          <Slider1 />
        </div>
      </section>
      <section className="bg-[#F7F2E3] overflow-hidden lg:pt-[76px] pt-[50px] lg:pb-[94px] pb-[50px]">
        <Heading title="Blogs" />
        <div className="pt-[73px] max-w-[1440px] w-full mx-auto px-[20px] lg:block hidden">
          {blogsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-xl">Loading blogs...</div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blogs available at the moment.</p>
            </div>
          ) : (
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
                      <Link href={`/blog/${blog.slug}`}>
                        <h6 className="font-avenir-400 text-[20px] underline text-[#000000] cursor-pointer hover:text-[#BA7E38] transition">Read Blog</h6>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="flex justify-center pt-[30px]">
            <Link href="/blog" className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">VIEW ALL </Link>
          </div>
        </div>
        <div className="pt-[33px] blog-slider max-w-[1440px] w-full mx-auto block lg:hidden">
          <BlogSlider />
          <div className="flex justify-center pt-[30px]">
            <Link href="/blog" className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">VIEW ALL </Link>
          </div>
        </div>
      </section>
      <section className="lg:pt-[138px] pt-[50px] relative lg:pb-[114px] pb-[50px] px-[20px]">
        <div className="absolute lg:block hidden top-[95px] left-0">
          <Image src="/images/faq/wrap1.svg" height={750.48} width={223} alt="wrap1" />
        </div>
        <div className="absolute lg:block hidden top-[95px] right-0">
          <Image src="/images/faq/wrap2.svg" height={750.48} width={223} alt="wrap1" />
        </div>
        <Heading title="Frequently Asked Questions" />
        <p className="pt-[8px] text-center font-avenir-400 lg:text-[18px] text-[14px] text-[#000000] lg:tracking-[4%] tracking-[2%] lg:pb-[44px] pb-[40px]">Got questions? Find answers to the most common questions about us.</p>
        <div className="max-w-[625px] relative z-10 w-full mx-auto">
          {faq.map((item, index) => (
            <div key={index} className=" overflow-hidden">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between border-b-[2px] border-[#00000020] pb-[12px] cursor-pointer items-center p-4 transition"
              >
                <span className="fontavenir-400 lg:text-[26px] text-[16px] text-[#000000]">{item.fTitle}</span>
                <span className="text-xl lg:h-[38px] h-[20px] lg:w-[38px] w-[20px] rounded-full bg-[#12121226] flex justify-center items-center">{activeIndex === index ? "-" : "+"}</span>
              </button>
              {activeIndex === index && (
                <div className="p-4 bg-white text-gray-700">
                  {item.fText}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

