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
        autoplay: false,
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
                <ul className="flex gap-3 absolute lg:bottom-[158px] lg:left-[50px] left-[20px] lg:translate-[0%]">{dots}</ul>
            </div>
        ),
    }
    return (
        <div className="max-w-[1205px] w-full mx-auto">
            <Slider {...settings}>
                {/* <div>
                    <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative lg:rounded-[24px]">
                    <div>
                className="lg:block hidden"         <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-[0] gap-[50px]">
                </div>
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] lg:block hidden bottom-0 absolute" />
                            <div className="lg:px-[50px] px-[20px] lg:pb-[36px] lg:pt-[36px] lg:max-w-full max-w-[374px] w-full">
                                <h6 className="font-rose font-[400] lg:pb-[16px] pb-[40px] text-[32px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] lg:pb-[16px] pb-[20px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-400 text-[20px] leading-[28px] text-[#FFFFFF] lg:pb-[16px] pb-[20px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                <p className="font-avenir-400 lg:pb-[98px] pb-[70px] lg:text-[20px] text-[18px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise" className="font-avenir-400 text-[18px] text-[#FFFFFF] lg:py-[14px] py-[10px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">EXPLORE </Link>
                            </div>
                            <div className="lg:px-0 px-[30px] lg:pb-0 pb-[50px] max-w-[508px] w-full">
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] h-full w-full object-cover rounded-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div> */}
                <div>
                    <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative lg:rounded-[24px]">
                    <div className="lg:block hidden">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] bottom-0 absolute" />
                    </div>
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px] lg:pb-[36px] lg:pt-[36px]">
                                <h6 className="font-rose font-[400] lg:pb-[16px] pb-[40px] text-[32px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] lg:pb-[16px] pb-[20px] w-full font-avenir-400 lg:lg:text-[20px] text-[18px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-400 text-[20px] leading-[28px] text-[#FFFFFF] lg:pb-[16px] pb-[20px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                <p className="font-avenir-400 lg:pb-[78px] pb-[70px] lg:lg:text-[20px] text-[18px] text-[18px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise">
                                    <button className="font-avenir-400 text-[18px] text-[#FFFFFF] lg:py-[14px] py-[10px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">
                                        EXPLORE
                                    </button>
                                </Link>
                            </div>
                            <div className="lg:px-0 px-[30px] lg:pb-0 pb-[50px] max-w-[508px] w-full">
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] h-full w-full object-cover rounded-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative lg:rounded-[24px]">
                    <div className="lg:block hidden">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] lg:block hidden bottom-0 absolute" />
                    </div>
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px] lg:pb-[36px] lg:pt-[36px]">
                                <h6 className="font-rose font-[400] lg:pb-[16px] pb-[40px] text-[32px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] lg:pb-[16px] pb-[20px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-400 text-[20px] leading-[28px] text-[#FFFFFF] lg:pb-[16px] pb-[20px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                  <p className="font-avenir-400 lg:pb-[78px] pb-[70px] lg:text-[20px] text-[18px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise">
                                    <button className="font-avenir-400 text-[18px] text-[#FFFFFF] lg:py-[14px] py-[10px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">
                                        EXPLORE
                                    </button>
                                </Link>
                            </div>
                            <div className="lg:px-0 px-[30px] lg:pb-0 pb-[50px] max-w-[508px] w-full">
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] h-full w-full object-cover rounded-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative lg:rounded-[24px]">
                    <div className="lg:block hidden">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] lg:block hidden bottom-0 absolute" />
                    </div>
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px] lg:pb-[36px] lg:pt-[36px]">
                                <h6 className="font-rose font-[400] lg:pb-[16px] pb-[40px] text-[32px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] lg:pb-[16px] pb-[20px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-400 text-[20px] leading-[28px] text-[#FFFFFF] lg:pb-[16px] pb-[20px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                  <p className="font-avenir-400 lg:pb-[78px] pb-[70px] lg:text-[20px] text-[18px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise">
                                    <button className="font-avenir-400 text-[18px] text-[#FFFFFF] lg:py-[14px] py-[10px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">
                                        EXPLORE
                                    </button>
                                </Link>
                            </div>
                            <div className="lg:px-0 px-[30px] lg:pb-0 pb-[50px] max-w-[508px] w-full">
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] h-full w-full object-cover rounded-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="max-w-[1205px] w-full mx-auto bg-[#4D0B2F] lg:pt-0 pt-[30px] relative lg:rounded-[24px]">
                    <div className="lg:block hidden">
                        <Image src="/images/home/wrapper2.svg" height={193} width={242} alt="wrapper" className="left-[350px] lg:block hidden bottom-0 absolute" />
                    </div>
                        <div className="flex justify-between relative items-center lg:flex-row flex-col lg:gap-0 gap-[50px]">
                            <div className="lg:px-[50px] px-[20px] lg:pb-[36px] lg:pt-[36px]">
                                <h6 className="font-rose font-[400] lg:pb-[16px] pb-[40px] text-[32px] text-[#FFB660]">The Royal Promise</h6>
                                <p className="max-w-[538px] lg:pb-[16px] pb-[20px] w-full font-avenir-400 lg:text-[20px] text-[18px] text-[#FFFFFF]">At Raajsi, luxury meets responsibility. Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                                <p className="max-w-[587px] w-full font-avenir-400 text-[20px] leading-[28px] text-[#FFFFFF] lg:pb-[16px] pb-[20px]">Time-tested formulas derived from ancient sciences and scriptures</p>
                                  <p className="font-avenir-400 lg:pb-[78px] pb-[70px] lg:text-[20px] text-[18px] text-[#FFFFFF]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                <Link href="/the-royal-promise">
                                    <button className="font-avenir-400 text-[18px] text-[#FFFFFF] lg:py-[14px] py-[10px] px-[50px] bg-[#BA7E38] rounded-full border border-[#BA7E38] an hover:bg-transparent hover:text-[#BA7E38]">
                                        EXPLORE
                                    </button>
                                </Link>
                            </div>
                            <div className="lg:px-0 px-[30px] lg:pb-0 pb-[50px] max-w-[508px] w-full">
                                <Image src="/images/home/img4.png" className="lg:rounded-r-[24px] h-full w-full object-cover rounded-[24px]" alt="The Royal Promise" height={549} width={499} />
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    )
}

export default Slider1
