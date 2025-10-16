"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import React, { useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import CartButton from "../components/CartButton";
import WishlistButton from "../components/WishlistButton";

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute lg:top-1/2 top-[30%] lg:right-[-50px] right-[-10px] z-20 transform -translate-y-1/2"
  >
    <img src="/images/home/next.svg" alt="Next" className="w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute lg:top-1/2 top-[30%] left-[-10px] lg:left-[-50px] z-20 transform -translate-y-1/2"
  >
    <img src="/images/home/prev.svg" alt="Previous" className="w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]" />
  </button>
);

function FeatureSlider({ featureData }) {
  const [openModal, setOpenModal] = useState(false);
  const [benefits, setBenefits] = useState(false);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };
  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      {featureData && featureData.length > 0 ? (
        <div>
          <div className="px-[0px] lg:hidden block">
            <Slider {...settings2}>
              {featureData.map((item, idx) => (
                <div key={idx}>
                  <div className="w-full max-w-[634px] mx-auto">
                    <div className="relative rounded-[20px] h-[250px] md:h-[433px] overflow-hidden">
                      <Image
                        src={item?.productImageUrl?.[0]}
                        alt="product"
                        fill
                        className="rounded-[20px] object-cover"
                      />
                      <div
                        className="absolute bottom-0 left-0 w-full h-[120px] md:h-[206px]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                        }}
                      ></div>
                      <div className="absolute top-0 w-full z-10 p-[15px] md:p-[30px]">
                        <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] md:flex-row flex-col">
                          <div className="flex items-center gap-[10px] md:gap-[14px]">
                            <button onClick={() => setOpenModal(true)}>
                              <Image
                                src="/images/home/lag.svg"
                                height={30}
                                width={30}
                                alt="le"
                              />
                            </button>
                            <h6 className="font-avenir-400 text-[10px] md:text-[12px] text-[#363636] max-w-[200px]">
                              मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                            </h6>
                          </div>
                          <button onClick={() => setBenefits(true)} className="bg-[#3030304A] cursor-pointer font-avenir-400 text-[12px] md:text-[14px] text-[#FFFFFF] py-[6px] px-[14px] md:py-[10px] md:px-[22px] rounded-full">
                            Ingredients & Benefits
                          </button>
                        </div>
                      </div>

                      {/* Bottom overlay */}
                      <div className="absolute bottom-0 w-full z-10 p-[15px] md:p-[30px]">
                        <h6 className="font-rose font-[400] text-[18px] md:text-[32px] text-[#FFFFFF] pb-[6px]">
                          {item?.productTitle}
                        </h6>
                        <p className="font-avenir-400 text-[12px] md:text-[20px] text-[#FFFFFF]">
                          {item?.productDescription}
                        </p>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] flex-row py-[18px]">
                      <div className="flex gap-[6px] md:flex-row flex-col items-start w-full">
                        <Link href="/products/1" className="w-full md:w-auto">
                          <button className="font-avenir-400 w-full md:max-w-[206px] text-[14px] text-[#FFFFFF] py-[6px] px-[10px] bg-[#BA7E38] rounded-full border border-[#BA7E38] hover:bg-transparent hover:text-[#BA7E38] transition-all">
                            VIEW PRODUCT
                          </button>
                        </Link>
                        <div className="flex gap-[10px]">
                          <CartButton productId={item._id} />
                          <WishlistButton productId={item._id} />
                          {item.amazonLink && (
                            <button 
                              onClick={() => window.open(item.amazonLink, '_blank')}
                              className="bg-[#FF9900] hover:bg-[#E47911] rounded-full transition-all flex items-center justify-center cursor-pointer"
                            >
                              <Image src="/images/amazon.svg" alt="Amazon" height={40} width={40} className="object-cover md:h-[52px] md:w-[52px]" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-right w-full md:max-w-[170px]">
                        <h6 className="font-avenir-800 text-[20px] md:text-[24px] text-[#000000]">
                          ₹{item?.salePrice}
                        </h6>
                        {item?.regularPrice > item?.salePrice && (
                          <p className="font-avenir-400 text-[14px] md:text-[18px] text-[#00000099]">
                            Get{" "}
                            {Math.round(
                              ((item?.regularPrice - item?.salePrice) / item?.regularPrice) * 100
                            )}
                            % OFF &nbsp;
                            <span className="line-through">₹{item?.regularPrice}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="px-[15px] hidden lg:block">
            <Slider {...settings}>
              {featureData.map((item, idx) => (
                <div key={idx}>
                  <div className="w-full max-w-[634px] mx-auto">
                    <div className="relative rounded-[20px] h-[250px] md:h-[433px] overflow-hidden">
                      <Image
                        src={item?.productImageUrl?.[0]}
                        alt="product"
                        fill
                        className="rounded-[20px] object-cover"
                      />
                      <div
                        className="absolute bottom-0 left-0 w-full h-[120px] md:h-[206px]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                        }}
                      ></div>

                      {/* Top overlay */}
                      <div className="absolute top-0 w-full z-10 p-[15px] md:p-[30px]">
                        <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] md:flex-row flex-col">
                          <div className="flex items-center gap-[10px] md:gap-[14px]">
                            <button onClick={() => setOpenModal(true)}>
                              <Image
                                src="/images/home/lag.svg"
                                height={30}
                                width={30}
                                alt="le"
                              />
                            </button>
                            <h6 className="font-avenir-400 text-[10px] md:text-[12px] text-[#363636] max-w-[200px]">
                              मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                            </h6>
                          </div>
                          <button onClick={() => setBenefits(true)} className="bg-[#3030304A] font-avenir-400 text-[12px] md:text-[14px] text-[#FFFFFF] py-[6px] px-[14px] md:py-[10px] md:px-[22px] rounded-full">
                            Ingredients & Benefits
                          </button>
                        </div>
                      </div>

                      {/* Bottom overlay */}
                      <div className="absolute bottom-0 w-full z-10 p-[15px] md:p-[30px]">
                        <h6 className="font-rose font-[400] text-[18px] md:text-[32px] text-[#FFFFFF] pb-[6px]">
                          {item?.productTitle}
                        </h6>
                        <p className="font-avenir-400 text-[12px] md:text-[20px] text-[#FFFFFF]">
                          {item?.productDescription}
                        </p>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] md:flex-row flex-col py-[18px]">
                      <div className="flex gap-[6px] md:flex-row items-center w-full">
                        <Link href="/products/1" className="w-full md:w-auto">
                          <button className="font-avenir-400 w-full md:max-w-[206px] text-[16px] md:text-[18px] text-[#FFFFFF] py-[10px] md:py-[12px] px-[20px] md:px-[34px] bg-[#BA7E38] rounded-full border border-[#BA7E38] hover:bg-transparent hover:text-[#BA7E38] transition-all">
                            VIEW PRODUCT
                          </button>
                        </Link>
                        <div className="flex gap-[10px]">
                          <CartButton productId={item._id} />
                          <WishlistButton productId={item._id} />
                        </div>
                      </div>
                      <div className="text-center md:text-right w-full md:max-w-[180px]">
                        <h6 className="font-avenir-800 text-[20px] md:text-[24px] text-[#000000]">
                          ₹{item?.salePrice}
                        </h6>
                        {item?.regularPrice > item?.salePrice && (
                          <p className="font-avenir-400 text-[14px] md:text-[18px] text-[#00000099]">
                            Get{" "}
                            {Math.round(
                              ((item?.regularPrice - item?.salePrice) / item?.regularPrice) * 100
                            )}
                            % OFF &nbsp;
                            <span className="line-through">₹{item?.regularPrice}</span>
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          {openModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setOpenModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md py-[30px] px-[34px] relative"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="authModalTitle"
              >
                <button className="auth-close-btn" onClick={() => setOpenModal(false)} aria-label="Close login">&times;</button>
                <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] pb-[10px]">Shlok Meaning</h6>
                <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते ।
                  यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥</p>
                <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center italic">
          Features Product will be available soon. Stay tuned!
        </p>
      )}
      {benefits && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setBenefits(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md py-[30px] px-[34px] relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="authModalTitle"
          >
            <button className="auth-close-btn" onClick={() => setBenefits(false)} aria-label="Close login">&times;</button>
            <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] pb-[10px]">Ingredients</h6>
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C] max-w-[260px] pb-[10px] w-full mx-auto">Cosmic Body Oil</p>
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default FeatureSlider;
