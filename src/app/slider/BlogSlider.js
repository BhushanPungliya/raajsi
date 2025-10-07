"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";

const blogs = [
  { imgs: "/images/home/img5.png" },
  { imgs: "/images/home/img6.png" },
  { imgs: "/images/home/img7.png" },
]


// slick css import karna mat bhoolna
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const BlogSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1, // ek baar me ek hi slide
    slidesToScroll: 1,
    arrows: false,
    centerMode: true, // dono side thoda part visible hoga
    centerPadding: "30px",
    customPaging: (i) => (
      <div className="w-[20px] h-[8px] bg-[#BA7E384d] rounded-full"></div>
    ),
    appendDots: dots => (
      <div className="!m-0">
        <ul className="flex gap-3 absolute lg:bottom-[138px] bottom-[-20px] lg:left-[50px] left-[50%] lg:translate-[0%] translate-[-50%]">{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {blogs?.map((e, i) => (
          <div key={i} className="lg:px-2 max-w-[96%] w-full mx-auto">
            <div className="w-full rounded-[24px] bg-[#FFFFFF] shadow">
              <Image
                src={e?.imgs}
                height={219}
                width={390}
                alt="blog-img"
                className="rounded-t-[24px] w-full h-[219px] object-cover"
              />
              <div className="px-[30px] py-[18px]">
                <h6 className="font-avenir-400 text-[20px] text-[#000000] pb-[10px]">
                  Natural Ingredients connect it to actual people
                </h6>
                <div className="flex justify-between items-center pb-[16px]">
                  <p className="font-avenir-400 text-[18px] text-[#6C757D]">
                    June 28, 2018
                  </p>
                  <div className="flex gap-[10px] items-center">
                    <Image
                      alt="share"
                      height={16}
                      width={16}
                      src="/images/home/share.svg"
                    />
                    <p className="font-avenir-400 text-[18px] text-[#6C757D]">
                      1K shares
                    </p>
                  </div>
                </div>
                <h6 className="font-avenir-400 text-[20px] underline text-[#000000]">
                  Read Blog
                </h6>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlogSlider;
