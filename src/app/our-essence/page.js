import Image from 'next/image'
import React from 'react'

function Page() {
    return (
        <div>
            <section className="relative mt-[120px] sm:mt-[150px] lg:mt-[209px]">
                <div className='absolute max-w-[300px] sm:max-w-[350px] lg:max-w-[383px] w-full left-1/2 top-[200px] lg:top-[40px] -translate-x-1/2 h-auto'>
                    <Image
                        alt='wrap'
                        src="/images/royal/wrap2.svg"
                        height={235}
                        width={384}
                        className='object-cover w-full h-auto'
                    />
                </div>
                <div className="relative w-full pb-[120px] sm:pb-[130px] lg:pb-[150px] z-10 h-full px-[20px] sm:px-[40px]">
                    <h6 className="font-rose text-[20px] lg:text-[32px] text-center text-[#4C0A2E] pb-[10px]  lg:pb-[14px]">
                        At Raajsi, luxury meets responsibility.
                    </h6>
                    <p className="max-w-[100%] sm:max-w-[600px] md:max-w-[650px] lg:max-w-[719px] pb-[40px] text-center sm:pb-[45px] lg:pb-[50px] w-full mx-auto font-avenir-400 text-[14px] lg:text-[18px] uppercase text-[#000000] leading-[20px] lg:leading-[26px]">
                        Raajsi is a premium ayurvedic beauty and wellness brand with a royal touch. <br />
                        Combining elements of regal rituals and ayurveda, we invite you to immerse yourself in the scents, texture and colours of our heritage.
                    </p>
                    <button className="absolute bottom-[40px] sm:bottom-[48px] lg:bottom-[54px] left-1/2 -translate-x-1/2">
                        <Image
                            src="/images/home/arrow.svg"
                            height={36}
                            width={36}
                            className="arrow-bounce filter invert"
                            alt="scroll arrow"
                        />
                    </button>

                </div>
            </section>

            <section className="py-[62px]">
                <div className='max-w-[1440px] w-full mx-auto'>
                    <div className="grid lg:gap-[18px] gap-[50px]">
                        <div className="flex items-center justify-center lg:flex-row flex-col lg:gap-[96px] gap-[50px]">
                            <div className="w-full max-w-[538px] only-left-1440 lg:px-0 px-[20px]">
                                <h6 className="font-avenir-400 font-rose lg:pb-[30px] lg:text-[32px] text-[20px] text-[#4C0A2E]">Genesis</h6>
                                <p className="font-avemir-[400] lg:text-[18px] text-[14px] text-[#000000] max-w-[538px] w-full">Raajsi is a premium Ayurvedic wellness and beauty brand, crafted for those who seek grace, balance, and timeless elegance in their self-care. Rooted in the sacred traditions of Indian royalty and ancient healing, Raajsi is where Ayurveda meets regal ritual, creating an experience that is as restorative as it is luxurious.
                                </p>
                            </div>
                            <div className="relative max-w-[622px] w-full lg:h-[483px] h-auto order-first lg:order-last">
                                <Image
                                    src="/images/home/img1.png"
                                    alt="Hero"
                                    height={483} width={622}
                                    className="object-cover w-full rotate-[180deg] lg:h-[483px] h-auto"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:flex-row flex-col lg:gap-[96px] gap-[30px]">
                            <div className="relative max-w-[622px] w-full lg:h-[483px] h-auto ">
                                <Image
                                    src="/images/home/img1.png"
                                    alt="Hero"
                                    height={483} width={622}
                                    className="object-cover w-full lg:h-[483px] h-auto"
                                />
                            </div>
                            <div className="w-full max-w-[538px] only-right-1440 lg:px-0 px-[20px]">
                                <h6 className="font-avenir-400 font-rose lg:pb-[30px] lg:text-[32px] text-[20px] text-[#4C0A2E]">Creative / Artistic Description</h6>
                                <p className="font-avemir-[400] lg:text-[18px] text-[14px] text-[#000000] max-w-[538px] w-full">Bathed in the golden glow of tradition, Raajsi is a sensory journey through time — where the velvet touch of ubtans, the aroma of pure rose, and the soothing whispers of sandalwood evoke the grandeur of palatial rituals.Every drop, every grain, every scent is a nod to a time when beauty was sacred and rituals were revered. Here, skincare is poetry, and self-care is an ode to your inner queen.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:flex-row flex-col lg:gap-[96px] gap-[30px]">
                            <div className="w-full max-w-[538px] only-left-1440 lg:px-0 px-[20px]">
                                <h6 className="font-avenir-400 font-rose lg:pb-[30px] lg:text-[32px] text-[20px] text-[#4C0A2E]">Philosophy</h6>
                                <p className="font-avemir-[400] lg:text-[18px] text-[14px] text-[#000000] max-w-[538px] w-full">Raajsi is born from a belief that beauty should be real — honest in its origins and mindful in its making. With every product, we blend intention, integrity, and indulgence — drawing from royal wisdom and modern consciousness.</p>
                                <p className="font-avemir-[400] lg:text-[18px] text-[14px] text-[#000000] max-w-[538px] w-full">We source with care, craft with soul, and celebrate the grace that begins within. Because Raajsi isn’t just what you wear — it’s what you embody.</p>
                            </div>
                            <div className="relative max-w-[622px] w-full lg:h-[483px] h-auto order-first lg:order-last">
                                <Image
                                    src="/images/home/img1.png"
                                    alt="Hero"
                                    height={483} width={622}
                                    className="object-cover w-full rotate-[180deg] lg:h-[483px] h-auto"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:flex-row flex-col lg:gap-[96px] gap-[30px]">
                            <div className="relative max-w-[622px] w-full lg:h-[483px] h-auto">
                                <Image
                                    src="/images/home/img1.png"
                                    alt="Hero"
                                    height={483} width={622}
                                    className="object-cover w-full lg:h-[483px] h-auto"
                                />
                            </div>
                            <div className="w-full max-w-[538px] only-right-1440 lg:px-0 px-[20px]">
                                <h6 className="font-avenir-400 font-rose lg;pb-[30px] lg:text-[32px] text-[20px] text-[#4C0A2E]">Aspirational Royalty</h6>
                                <p className="font-avemir-[400] lg:text-[18px] text-[14px] text-[#000000] max-w-[538px] w-full">You don’t need a crown to feel regal. In a world of noise, your stillness is royal. In a world of haste, your ritual is a rebellion. <br />
                                    Raajsi is for the modern-day royalty — the ones who honour themselves enough to pause, restore, and rise. Because when you choose Raajsi, you don’t just care for your body. You honour your heritage.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Page
