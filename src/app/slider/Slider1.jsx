"use client";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Image from 'next/image'
import React from 'react'
import Slider from 'react-slick'
import Link from "next/link";

function Slider1() {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000, // 3s me slide change
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, // agar arrow nahi chahiye
        customPaging: (i) => (
            <div className="w-[20px] h-[8px] bg-[#ffffff4d] rounded-full"></div>
        ),
        appendDots: dots => (
            <div className="!m-0"> 
                <ul className="flex gap-3 absolute lg:bottom-[138px] bottom-[440px] lg:left-[50px] left-[50%] lg:translate-[0%] translate-[-50%]">{dots}</ul>
            </div>
        ),
    }
    return (
        <div className="max-w-[1205px] w-full mx-auto">
            <Slider {...settings}>
                <div>
                    <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative rounded-[24px]">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] bottom-0 absolute" />
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-[0] gap-[50px]">
                            <div className="lg:px-[50px] px-[20px]">
                                <h6 className="font-rose font-[400] pb-[16px] lg:text-[32px] text-[22px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] pb-[16px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-800 lg:text-[24px] text-[20px] leading-[28px] text-[#FFFFFF] italic pb-[16px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                <p className="font-avenir-400 lg:pb-[50px] pb-[20px] text-[20px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise" className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">EXPLORE </Link>
                            </div>
                            <div>
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] lg:rounded-b-0 rounded-b-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                   <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative rounded-[24px]">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] bottom-0 absolute" />
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px]">
                                <h6 className="font-rose font-[400] pb-[16px] lg:text-[32px] text-[22px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] pb-[16px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-800 lg:text-[24px] text-[20px] leading-[28px] text-[#FFFFFF] italic pb-[16px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                <p className="font-avenir-400 lg:pb-[50px] pb-[20px] text-[20px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise" className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">EXPLORE </Link>
                            </div>
                            <div>
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] lg:rounded-b-0 rounded-b-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                   <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative rounded-[24px]">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] bottom-0 absolute" />
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px]">
                                <h6 className="font-rose font-[400] pb-[16px] lg:text-[32px] text-[22px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] pb-[16px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-800 lg:text-[24px] text-[20px] leading-[28px] text-[#FFFFFF] italic pb-[16px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                <p className="font-avenir-400 lg:pb-[50px] pb-[20px] text-[20px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise" className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">EXPLORE </Link>
                            </div>
                            <div>
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] lg:rounded-b-0 rounded-b-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                   <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative rounded-[24px]">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] bottom-0 absolute" />
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px]">
                                <h6 className="font-rose font-[400] pb-[16px] lg:text-[32px] text-[22px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] pb-[16px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-800 lg:text-[24px] text-[20px] leading-[28px] text-[#FFFFFF] italic pb-[16px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                <p className="font-avenir-400 lg:pb-[50px] pb-[20px] text-[20px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise" className="font-avenir-400 text-[18px] text-[#FFFFFF] py-[14px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">EXPLORE </Link>
                            </div>
                            <div>
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] lg:rounded-b-0 rounded-b-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    )
}

export default Slider1
