import Image from 'next/image'

export default function HeroCard() {
  return (
    <figure className="relative overflow-hidden rounded-3xl bg-card h-[400px] md:h-[600px] lg:h-[680px] w-full">
      <Image
        src="/images/account/image.png"
        alt="Regal woman artwork with emblem and text 'Evoke the royalty in you'"
        fill
        sizes="(min-width: 1440px) 300px, (min-width: 1024px) 200px, (min-width: 768px) 200px, 100vw"
        className="object-cover object-center"
      />
    </figure>
  )
}
