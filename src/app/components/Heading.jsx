import Image from 'next/image'
import React from 'react'

function Heading({title}) {
    return (
        <div>
            <div className="flex justify-center items-center lg:gap-[26px] gap-[16px]">
                <Image src="/images/home/wrapper.svg" alt="Step 1" className='lg:h-[38px] h-[34px] lg:w-[53px] w-[24px] object-cover' width={53} height={38} />
                <h6 className="font-avenir-400 font-rose lg:text-[32px] text-center text-[18px] text-[#4C0A2E]">{title}</h6>
                <Image src="/images/home/wrapper.svg" alt="Step 1" width={53} height={38} className="rotate-180 lg:h-[38px] h-[34px] lg:w-[53px] w-[24px] object-cover" />
            </div>
        </div>
    )
}

export default Heading
