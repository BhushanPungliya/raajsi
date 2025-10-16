"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import React, { useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import CartButton from "../components/CartButton";
import WishlistButton from "../components/WishlistButton";
import ProductCard from "../components/ProductCard";

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
  // Limit to 5 most recent products
  const recentProducts = featureData?.slice(0, 5) || [];
  
  const settings = {
    dots: false,
    infinite: recentProducts.length > 2, // Only infinite if more than 2 items
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
    infinite: recentProducts.length > 1, // Only infinite if more than 1 item
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      {recentProducts && recentProducts.length > 0 ? (
        <div>
          <div className="px-[0px] lg:hidden block">
            <Slider {...settings2}>
              {recentProducts.map((item, idx) => (
                <div key={idx} className="px-2">
                  <ProductCard
                    product={{
                      id: item._id,
                      name: item.productTitle,
                      desc: item.productDescription,
                      image: item.productImageUrl?.[0] || '/images/home/img3.jpg',
                      images: item.productImageUrl || [],
                      price: item.salePrice,
                      oldPrice: item.regularPrice,
                      rating: item.rating || 4.5,
                      reviewCount: item.reviewCount || 0,
                      availability: item.isActive ? 'In Stock' : 'Unavailable',
                      stock: item.stock || null,
                      highlights: item.highlights || [],
                      ingredients: item.ingredients || '',
                      benefits: item.benefits || '',
                      shlok: item.shlok || { shlokText: '', shlokMeaning: '' },
                      amazonLink: item.amazonLink || '',
                      howToUse: item.careHandling || '',
                      logo: '/images/home/lag.svg',
                    }}
                    showShloka={true}
                    showTag={true}
                    cardHeight="400px"
                    isMobile={true}
                    className="mb-4"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="px-[15px] hidden lg:block">
            <Slider {...settings}>
              {recentProducts.map((item, idx) => (
                <div key={idx} className="px-2">
                  <ProductCard
                    product={{
                      id: item._id,
                      name: item.productTitle,
                      desc: item.productDescription,
                      image: item.productImageUrl?.[0] || '/images/home/img3.jpg',
                      images: item.productImageUrl || [],
                      price: item.salePrice,
                      oldPrice: item.regularPrice,
                      rating: item.rating || 4.5,
                      reviewCount: item.reviewCount || 0,
                      availability: item.isActive ? 'In Stock' : 'Unavailable',
                      stock: item.stock || null,
                      highlights: item.highlights || [],
                      ingredients: item.ingredients || '',
                      benefits: item.benefits || '',
                      shlok: item.shlok || { shlokText: '', shlokMeaning: '' },
                      amazonLink: item.amazonLink || '',
                      howToUse: item.careHandling || '',
                      logo: '/images/home/lag.svg',
                    }}
                    showShloka={true}
                    showTag={true}
                    cardHeight="433px"
                    className="mb-4"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center italic">
          Features Product will be available soon. Stay tuned!
        </p>
      )}
    </>
  );
}

export default FeatureSlider;
