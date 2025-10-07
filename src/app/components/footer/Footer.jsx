import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <div>
            <div>
                <section className="bg-[#BA7E38] relative">
                    <div className="max-w-[1440px] w-full mx-auto py-[35px] lg:px-[100px] px-[20px]">
                        <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-x-[70px] gap-y-[0px]">
                            <div className="flex gap-[14px] lg:flex-row flex-col items-center lg:pb-0 pb-[30px] lg:pt-0 pt-[26px] lg:border-none border-b border-r border-[#FFFFFF]">
                                <Image src="/images/faq/icon1.svg" className='lg:h-[45px] h-[20px] lg:w-[45px] w-[20px] object-cover' height={45} width={45} alt="icon1" />
                                <p className="font-avenir-400 lg:text-[16px] text-[12px] lg:max-w-full max-w-[140px] w-full mx-auto lg:text-left text-center capitalize text-[#FFFFFF]">No tests on animals</p>
                            </div>
                            <div className="flex gap-[14px] lg:flex-row flex-col items-center lg:pb-0 pb-[30px] lg:pt-0 pt-[26px] lg:border-none border-b border-[#FFFFFF]">
                                <Image src="/images/faq/icon2.svg" className='lg:h-[45px] h-[20px] lg:w-[45px] w-[20px] object-cover' height={45} width={45} alt="icon2" />
                                <p className="font-avenir-400 lg:text-[16px] text-[12px] lg:max-w-full max-w-[140px] w-full mx-auto text-center lg:text-left capitalize text-[#FFFFFF]">No animal-derived ingredients</p>
                            </div>
                            <div className="flex gap-[14px] lg:flex-row flex-col items-center lg:pt-0 pt-[30px] lg:pb-0 pb-[26px] lg:border-none border-r border-[#FFFFFF]">
                                <Image src="/images/faq/icon3.svg" className='lg:h-[45px] h-[20px] lg:w-[45px] w-[20px] object-cover' height={45} width={45} alt="icon3" />
                                <p className="font-avenir-400 lg:text-[16px] text-[12px] lg:max-w-full max-w-[140px] w-full mx-auto lg:text-left text-center capitalize text-[#FFFFFF]">No gluten, or gluten byproducts</p>
                            </div>
                            <div className="flex gap-[14px] lg:flex-row flex-col items-center lg:pt-0 pt-[30px] lg:pb-0 pb-[26px] lg:border-none border-[#FFFFFF]">
                                <Image src="/images/faq/icon4.svg" className='lg:h-[45px] h-[20px] lg:w-[45px] w-[20px] object-cover' height={45} width={45} alt="icon4" />
                                <p className="font-avenir-400 lg:text-[16px] text-[12px] lg:max-w-full max-w-[140px] text-center lg:text-left w-full mx-auto capitalize text-[#FFFFFF]">Recyclable packaging</p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className='bg-[#4C0A2E] lg:pt-[80px] pt-[40px] lg:pb-[64px] pb-[32px]'>
                    <div className="max-w-[1440px] mx-auto w-full lg:px-[100px] px-[20px]">
                        <div className='block pb-[52px] lg:hidden'>
                            <Link href="/">
                                <Image src="/images/header/logo.svg" height={100} width={111} alt='Logo' />
                            </Link>
                        </div>
                        <div className="flex lg:gap-[40px] gap-[20px] lg:flex-row flex-col">
                            <div className='grid lg:grid-cols-3 w-full grid-cols-2 gap-[20px]'>
                                <div className='lg:block hidden'>
                                    <Link href="/">
                                        <Image src="/images/header/logo.svg" height={100} width={111} alt='Logo' />
                                    </Link>
                                </div>
                                <div>
                                    <h6 className="font-avenir-800 text-[24px] text-[#FFFFFF] lg:pb-[16px] pb-[18px]">About</h6>
                                    <ul className='flex flex-col gap-[8px]'>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Our Essence</li>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>The Royal Promise</li>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Rediscover Ayurveda</li>
                                        <Link href="/blog" className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Blog</Link>
                                        <Link href="/contact" className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Contact</Link>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="font-avenir-800 text-[24px] text-[#FFFFFF] lg:pb-[16px] pb-[18px]">Products</h6>
                                    <ul className='flex flex-col gap-[8px]'>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Ritual Kits</li>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Hair Care</li>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Body care</li>
                                        <li className='font-avenir-400 text-[16px] text-[#FFFFFF]'>Skin Care</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="max-w-[600px] lg:pt-0 pt-[30px] w-full">
                                <h6 className="font-avenir-800 text-[24px] text-[#FFFFFF] pb-[16px]">keep in touch with Raajsi</h6>
                                <p className="font-avenir-400 text-[16px] text-[#FFFFFF] pb-[16px] ">Join the Raajsi newsletter and be first to hear about news, offers and skincare advice</p>
                                <div className="flex items-end pb-[8px] gap-[16px]">
                                    <input type="text" className='py-[10px] font-avenir-400 px-[16px] border-b border-[#CBCBCB] max-w-[480px] w-full text-[#CBCBCB] placeholder-[#CBCBCB] text-[20px]' placeholder='Email Address' />
                                    <button className='bg-[#FFFFFF] text-[#BA7E38] py-[9.5px] px-[15px] text-[16px] font-avenir-400'>Subscribe</button>
                                </div>
                                <div className="flex gap-[10px] items-start">
                                    <input type="checkbox" className='mt-[6px] bg-transparent border-[2px] border-[#FFFFFF] h-[16px] w-[16px]' name="" id="" />
                                    <p className="font-avenir-400 text-[16px] text-[#FFFFFF] ">By submitting your email, you agree to receive advertising emails fromRaajsi.
                                        Please review our Privacy Policy, which includes our Financial Incentive Notice for CA residents.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-[#BA7E38] py-[12px]'>
                    <div className="max-w-[1440px] w-full mx-auto lg:px-[100px] px-[20px]">
                        <div className="flex justify-between lg:flex-row flex-col items-center lg:gap-0 gap-[20px]">
                            <div className='flex items-center lg:flex-row flex-col lg:gap-[14px] gap-0'>
                                <div className='flex items-center gap-[8px] py-[8px]'>
                                    <Image alt='location' src="/images/footer/location.svg" height={24} width={24} />
                                    <p className="font-avenir-400 text-[16px] text-[#FFFFFF]">Indore, Vijay Nagar, Palasia</p>
                                </div>
                                <div className='h-[24px] lg:block hidden w-[1px] bg-[#FFFAFA]'></div>
                                <div className='flex items-center gap-[8px] py-[8px]'>
                                    <Image alt='call' src="/images/footer/call.svg" height={24} width={24} />
                                    <p className="font-avenir-400 text-[16px] text-[#FFFFFF]">1-802-526-2463</p>
                                </div>
                            </div>
                            <div className='flex gap-[8px]'>
                                <Image alt='icon1' src="/images/footer/icon1.svg" height={40} width={40} />
                                <Image alt='icon2' src="/images/footer/icon2.svg" height={40} width={40} />
                                <Image alt='icon3' src="/images/footer/icon3.svg" height={40} width={40} />
                                <Image alt='icon4' src="/images/footer/icon4.svg" height={40} width={40} />
                                <Image alt='icon5' src="/images/footer/icon5.svg" height={40} width={40} />
                                <Image alt='icon6' src="/images/footer/icon6.svg" height={40} width={40} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#14010A] lg:py-[16px] py-[20px]">
                    <div className="max-w-[1440px] flex lg:flex-row flex-col-reverse lg:gap-0 gap-[20px] lg:items-center justify-between w-full mx-auto lg:px-[100px] px-[20px]">
                        <div className="flex items-center gap-[8px]">
                            <Image alt='copyright' src="/images/footer/copyright.svg" height={24} width={24} />
                            <p className="font-avenir-400 text-[16px] text-[#CBCBCB]">2025 Raajsi. All Rights Reserved.</p>
                        </div>
                        <div className="flex gap-[24px] items-center">
                            <Link href="/terms-conditions" className="font-avenir-400 text-[16px] text-[#CBCBCB]">
                                Terms & Conditions
                            </Link>
                            <Link href="/privacy-policy" className="font-avenir-400 text-[16px] text-[#CBCBCB]">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
