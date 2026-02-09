'use client';
import Image from 'next/image'
import React, { useRef } from 'react'
import Heading from '../components/Heading'

function Page() {
    const nextSectionRef = useRef(null);

    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };
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
                    <h2 className='font-rose text-[32px] text-[#FFFFFF] pb-[20px]'>At Raajsi, luxury meets responsibility.</h2>
                    <p className="font-avenir-400 text-[18px] text-[#FFFFFF] max-w-[671px] w-full">Our royal promise is built on integrity, transparency, and timeless care - for you and the planet.</p>
                    {/* <h2 className="max-w-[634px] w-full font-[400] lg:text-[41px] text-[26px] text-[#FFFAFA] ">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                        यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</h2> */}
                    <button onClick={handleScroll} className="absolute cursor-pointer bottom-[128px] left-[50%] -translate-x-1/2 ">
                        <Image src="/images/home/arrow.svg" height={42} width={42} className="arrow-bounce" alt="" />
                    </button>
                </div>
            </section>
            <section ref={nextSectionRef} className='pt-[66px] overflow-hidden bg-[#F9F3EC]'>
                <div className="max-w-[1440px] w-full mx-auto lg:px-[54px] px-[20px]">
                    <Heading title="The Royal Promise" />
                    <div className='lg:py-[0px] py-[60px] overflow-hidden lg:my-[104px] mt-[0px] relative rounded-[20px]'>
                        <div className="lg:flex hidden flex-col gap-[68px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                            <div className="flex flex-col items-center gap-[30px]">
                                <Image alt='wrap' height={19} width={27} src="/images/royal/wrap1.svg" />
                                <div className="h-[222px] w-[1px] bg-[#D7BA98]"></div>
                            </div>
                            <div className="flex flex-col items-center gap-[30px]">
                                <Image alt='wrap' height={19} width={27} src="/images/royal/wrap1.svg" />
                                <div className="h-[222px] w-[1px] bg-[#D7BA98]"></div>
                            </div>
                            <div className="flex flex-col items-center gap-[30px]">
                                <Image alt='wrap' height={19} width={27} src="/images/royal/wrap1.svg" />
                                <div className="h-[222px] w-[1px] bg-[#D7BA98]"></div>
                            </div>
                            <div className="flex flex-col items-center gap-[30px]">
                                <Image alt='wrap' height={19} width={27} src="/images/royal/wrap1.svg" />
                                <div className="h-[222px] w-[1px] bg-[#D7BA98]"></div>
                            </div>
                            <div className="flex flex-col items-center gap-[30px]">
                                <Image alt='wrap' height={19} width={27} src="/images/royal/wrap1.svg" />
                                <div className="h-[222px] w-[1px] bg-[#D7BA98]"></div>
                            </div>
                        </div>
                        <div className="grid lg:gap-[30px] gap-[40px]">
                            <div className='grid lg:grid-cols-2 grid-cols-1 lg:gap-[124px] gap-[10px]'>
                                <div className='max-w-[430px] w-full lg:ml-auto'>
                                    <Image src="/images/royal/img1.png" className='rounded-[20px] object-cover h-[246px]' height={246} width={430} alt='img1' />
                                </div>
                                <div className='lg:pt-[42px] max-w-[638px] w-full pt-[12px]'>
                                    <h6 className="font-rose lg:text-[36px] text-[16px] lg:leading-[45px] leading-[24px] text-[#4C0A2E]">Time-tested formulas derived from ancient sciences and scriptures</h6>
                                    <p className="lg:pt-[20px] font-avenir-400 lg:text-[20px] text-[14px] lg:leading-[35px] leading-[20px] text-[#000000]">Rooted in Ayurveda and proven through generations of ritual wisdom.</p>
                                </div>
                            </div>
                            <div className='grid lg:grid-cols-2 grid-cols-1 lg:gap-[124px] gap-[10px]'>
                                <div className='max-w-[430px] w-full lg:mr-auto order-first lg:order-last'>
                                    <Image
                                        src="/images/royal/img1.png"
                                        className='rounded-[20px] object-cover h-[246px] w-full'
                                        height={246}
                                        width={430}
                                        alt='img1'
                                    />
                                </div>
                                <div className='lg:pt-[42px] max-w-[638px] w-full lg:text-right text-left pt-[12px]'>
                                    <h6 className="font-rose lg:text-[36px] text-[16px] lg:leading-[45px] leading-[24px]  text-[#4C0A2E]">
                                        High-quality, organic ingredients for optimal efficacy
                                    </h6>
                                    <p className="lg:pt-[20px] font-avenir-400 lg:text-[20px] text-[14px] lg:leading-[35px] leading-[20px] text-[#000000]">
                                        Sourced from certified farms to ensure purity and potency in every drop.
                                    </p>
                                </div>
                            </div>
                            <div className='grid lg:grid-cols-2 grid-cols-1 lg:gap-[124px] gap-[10px]'>
                                <div className='max-w-[430px] w-full lg:ml-auto'>
                                    <Image src="/images/royal/img1.png" className='rounded-[20px] object-cover h-[246px]' height={246} width={430} alt='img1' />
                                </div>
                                <div className='lg:pt-[42px] max-w-[638px] w-full pt-[12px]'>
                                    <h6 className="font-rose lg:text-[36px] text-[16px] lg:leading-[45px] leading-[24px]  text-[#4C0A2E]">Eco-friendly manufacturing processes</h6>
                                    <p className="lg:pt-[20px] font-avenir-400 lg:text-[20px] text-[14px] lg:leading-[35px] leading-[20px] text-[#000000]">Produced in small batches using low-impact, conscious methods.</p>
                                </div>
                            </div>
                            <div className='grid lg:grid-cols-2 grid-cols-1 lg:gap-[124px] gap-[10px]'>
                                <div className='max-w-[430px] w-full lg:mr-auto order-first lg:order-last'>
                                    <Image
                                        src="/images/royal/img1.png"
                                        className='rounded-[20px] object-cover h-[246px] w-full'
                                        height={246}
                                        width={430}
                                        alt='img1'
                                    />
                                </div>
                                <div className='lg:pt-[42px] max-w-[638px] w-full pt-[12px] lg:text-right text-left'>
                                    <h6 className="font-rose lg:text-[36px] text-[16px] lg:leading-[45px] leading-[24px]  text-[#4C0A2E]">
                                        Cruelty-free and sustainable practices
                                    </h6>
                                    <p className="lg:pt-[20px] font-avenir-400 lg:text-[20px] text-[14px] lg:leading-[35px] leading-[20px] text-[#000000]">
                                        Approved by ethical standards—never tested on animals, always kind to nature.
                                    </p>
                                </div>
                            </div>
                            <div className='grid lg:grid-cols-2 grid-cols-1 lg:gap-[124px] gap-[10px]'>
                                <div className='max-w-[430px] w-full lg:ml-auto'>
                                    <Image src="/images/royal/img1.png" className='rounded-[20px] object-cover h-[246px]' height={246} width={430} alt='img1' />
                                </div>
                                <div className='lg:pt-[42px] max-w-[638px] w-full pt-[12px]'>
                                    <h6 className="font-rose lg:text-[36px] text-[16px] lg:leading-[45px] leading-[24px]  text-[#4C0A2E]">Biodegradable packaging </h6>
                                    <p className="lg:pt-[20px] font-avenir-400 lg:text-[20px] text-[14px] lg:leading-[35px] leading-[20px] text-[#000000]">Our packaging is designed to decompose naturally, leaving no lasting footprint</p>
                                </div>
                            </div>
                            <div className='grid lg:grid-cols-2 grid-cols-1 lg:gap-[124px] gap-[10px]'>
                                <div className='max-w-[430px] w-full lg:mr-auto order-first lg:order-last'>
                                    <Image
                                        src="/images/royal/img1.png"
                                        className='rounded-[20px] object-cover h-[246px] w-full'
                                        height={246}
                                        width={430}
                                        alt='img1'
                                    />
                                </div>
                                <div className='lg:pt-[42px] max-w-[638px] w-full lg:text-right text-left pt-[12px]'>
                                    <h6 className="font-rose lg:text-[36px] text-[16px] lg:leading-[45px] leading-[24px]  text-[#4C0A2E]">
                                        Certificates of Analysis
                                    </h6>
                                    <p className="lg:pt-[20px] font-avenir-400 lg:text-[20px] text-[14px] lg:leading-[35px] leading-[20px] text-[#000000]">
                                        Every batch is lab-tested and verified for safety, authenticity, and performance.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Page
