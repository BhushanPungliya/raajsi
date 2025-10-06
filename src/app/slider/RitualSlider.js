"use client";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

const sliderData = [
  {
    title: "From Palace to You: A Body Ritual",
    desc: "Discover herbs used by royal queens for skincare and wellness. Each product is infused with the wisdom of Ayurveda and crafted for your modern lifestyle.",
    subText: "Step into royal indulgence.",
    img: "/images/home/img2.png",
    btn: "VIEW PRODUCTS",
    link: "/feature-products"
  },
  {
    title: "Timeless Herbal Secrets",
    desc: "Discover herbs used by royal queens for skincare and wellness. Each product is infused with the wisdom of Ayurveda and crafted for your modern lifestyle.",
    subText: "Ancient recipes, modern touch.",
    img: "/images/home/img2.png",
    btn: "EXPLORE NOW",
    link: "/feature-products"
  },
  {
    title: "Royal Oils of India",
    desc: "From sesame to almond oils, queens trusted herbal oils to nourish skin and hair. Our oils revive these traditions with authentic blends.",
    subText: "Luxury that heals.",
    img: "/images/home/img2.png",
    btn: "SHOP OILS",
    link: "/feature-products"
  },
  {
    title: "Sacred Rituals Revived",
    desc: "Rituals once reserved for palaces are now brought to your home. Scrubs, soaps, and oils inspired by timeless practices.",
    subText: "Bring the palace home.",
    img: "/images/home/img2.png",
    btn: "DISCOVER MORE",
    link: "/feature-products"
  },
];

export default function RitualSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,  // ek bar me ek item
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {sliderData.map((item, idx) => (
          <div key={idx}>
            <div className="rounded-t-[24px] overflow-hidden bg-[#FEFEFE] lg:px-[100px] px-[16px] lg:pt-[50px] pt-[26px] flex justify-between lg:flex-row flex-col">
              <div className="max-w-[538px] w-full lg:pb-[234px] pb-[20px]">
                <h6 className="font-rose font-[400] lg:text-[24px] text-[16px] lg:text-left text-center tracking-[4%] text-[#4C0A2E] pb-[14px]">
                  {item.title}
                </h6>
                <p className="font-avenir-400 lg:text-[16px] text-[14px] lg:text-left text-center text-[#0C0C0C] lg:pb-[24px] pb-[20px]">
                  {item.desc}
                </p>
                <p className="font-avenir-400 lg:text-[20px] text-[14px] text-[#727272] lg:text-left text-center lg:pb-[45px] pb-[20px]">
                  {item.subText}
                </p>
                <Link href={item.link} className="flex items-center justify-center">
                  <button className="font-avenir-400 lg:text-[18px] text-[14px] rounded-full text-[#FFFFFF] lg:py-[14px] py-[8px] lg:px-[24px] px-[16px] bg-[#4C0A2E] border border-[#4C0A2E] hover:bg-transparent hover:text-[#4C0A2E]">
                    {item.btn}
                  </button>
                </Link>
              </div>

              <div className="max-w-[335px] h-[380px] w-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  height={280}
                  width={235}
                  className="object-cover w-full rounded-t-full"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
