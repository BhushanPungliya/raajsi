"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";


const NextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute lg:right-[-40px] right-0 lg:top-[calc(50%-30px)] top-[calc(95%-30px)] -translate-y-1/2 z-10 "
    >
        <Image
            src="/images/faq/next.svg"
            height={40}
            width={40}
            alt="arrow"
        />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute lg:left-[-40px] left-0 lg:top-[calc(50%-30px)] top-[calc(95%-30px)] -translate-y-1/2 z-10"
    >
        <Image
            src="/images/faq/prev.svg"
            height={40}
            width={40}
            alt="arrow"
        />
    </button>
);

function TestSlider() {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024, // tablet
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640, // mobile
                settings: {
                    slidesToShow: 1,  // <---- yahan 1 item show hoga
                    slidesToScroll: 1,
                },
            },
        ],
    };
    const settings1 = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024, // tablet
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640, // mobile
                settings: {
                    slidesToShow: 1,  // <---- yahan 1 item show hoga
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div>
            <div className="relative max-w-[1440px] mx-auto px-4 lg:block hidden lg:px-[40px]">
                <Slider {...settings}>
                    {[1, 2, 3, 4, 5].map((item, i) => (
                        <div key={i} className="mt-[20px] mb-[100px]">
                            <div
                                style={{ boxShadow: "0px 4px 24px 0px #8BA7B229" }}
                                className="bg-[#FFFFFF] lg:max-w-[96%] lg:ml-[10px] w-full max-w-full rounded-[6px] py-[22px] px-[16px]"
                            >
                                <div className="relative pt-[16px]">
                                    <h6 className="text-[32px] absolute top-[0px] leading-[28.8px]">
                                        “
                                    </h6>
                                    <h6 className="text-[32px] absolute bottom-[0px] right-[30px] leading-[28.8px]">
                                        ”
                                    </h6>
                                    <p className="font-[400] font-avenir-400 text-[22px] leading-[28px] text-[#101418]">
                                        I love this Vitamin C serum, I can see my skin becomes brighter
                                        after one to two days only which is remarkable.
                                    </p>
                                </div>
                                <div className="flex items-center gap-[12px] pt-[20px] pb-[30px]">
                                    <div className="bg-[#D9D9D9] h-[50px] w-[50px] rounded-full"></div>
                                    <p className="font-avenir-400 text-[18px] text-[#7C8087]">
                                        – Luisa
                                    </p>
                                </div>
                                <div className="flex gap-[6px] items-center pb-[14px]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Image
                                            key={star}
                                            src="/images/footer/star.svg"
                                            height={24}
                                            width={24}
                                            alt="star"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="relative max-w-[1440px] mx-auto block lg:hidden lg:px-8">
                <Slider {...settings1}>
                    {[1, 2, 3, 4, 5].map((item, i) => (
                        <div key={i} className="mt-[20px] mb-[100px]">
                            <div
                                style={{ boxShadow: "0px 4px 24px 0px #8BA7B229" }}
                                className="bg-[#FFFFFF] lg:max-w-[96%] lg:ml-[10px] w-full max-w-full rounded-[6px] py-[22px] px-[16px]"
                            >
                                <div className="relative pt-[16px]">
                                    <h6 className="text-[32px] absolute top-[0px] leading-[28.8px]">
                                        “
                                    </h6>
                                    <h6 className="text-[32px] absolute bottom-[0px] right-[30px] leading-[28.8px]">
                                        ”
                                    </h6>
                                    <p className="font-[400] font-avenir-400 text-[22px] leading-[28px] text-[#101418]">
                                        I love this Vitamin C serum, I can see my skin becomes brighter
                                        after one to two days only which is remarkable.
                                    </p>
                                </div>
                                <div className="flex items-center gap-[12px] pt-[20px] pb-[30px]">
                                    <div className="bg-[#D9D9D9] h-[50px] w-[50px] rounded-full"></div>
                                    <p className="font-avenir-400 text-[18px] text-[#7C8087]">
                                        – Luisa
                                    </p>
                                </div>
                                <div className="flex gap-[6px] items-center pb-[14px]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Image
                                            key={star}
                                            src="/images/footer/star.svg"
                                            height={24}
                                            width={24}
                                            alt="star"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default TestSlider;
