import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import CartButton from './CartButton';
import WishlistButton from './WishlistButton';

const ProductCard = ({
  product,
  className = "",
  style = {},
  showShloka = false,
  showTag = true,
  cardHeight = "350px",
  isMobile = false,
  onShlokClick,
  onBenefitsClick
}) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [benefits, setBenefits] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sanskrit and English text
  const sanskritText = "मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते यया विध्यसि चेतांसि गुणैरेव न सायकैः ॥";
  const englishText = "O Charming One! An unprecedented archery is seen in you, by which you pierce hearts with virtues alone, not with arrows.";

  const toggleTranslation = () => {
    setIsTranslated(!isTranslated);
  };

  if (!product) return null;

  // Helper function to render modal with portal
  const renderModal = (isOpen, onClose, title, content) => {
    if (!mounted || !isOpen) return null;
    
    return createPortal(
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
        onClick={onClose}
        style={{ margin: 0 }}
      >
        <div
          className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md py-[30px] px-[34px] relative max-h-[50vh] overflow-y-auto modal-scroll"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="auth-close-btn" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            &times;
          </button>
          <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] pb-[10px]">
            {title}
          </h6>
          {content}
        </div>
      </div>,
      document.body
    );
  };

  // Mobile version card
  const mobileCard = (
    <div
      className={`w-full rounded-[15px] relative overflow-hidden shadow-md ${className}`}
      style={{
        height: cardHeight,
        backgroundImage: `url(${product.image || product.productImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
    >
      {/* Shloka - Optional */}
      {showShloka && (
        <div
          onClick={() => setOpenModal1(true)}
          className="absolute cursor-pointer top-4 left-4 text-white text-sm font-serif max-w-[70%] leading-6 z-20 rounded-md flex items-start gap-2 transition-opacity duration-300"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}
        >
          <Image
            src="/translate.png"
            alt="Translation"
            width={40}
            height={40}
            className="flex-shrink-0"
            style={{ marginTop: 2 }}
          />
          <div style={{ fontFamily: 'Georgia, serif', lineHeight: '1.5' }}>
            {product?.shlok?.shlokText || sanskritText}
          </div>
        </div>
      )}

      {/* Tag/Label - Optional */}
      {showTag && (
        <div 
          onClick={() => setBenefits(true)} 
          className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 text-xs rounded-full z-20 backdrop-blur-sm cursor-pointer"
        >
          Ingredients & Benefits
        </div>
      )}

      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/30 via-black/10 to-black/40" />

      {/* Content at bottom */}
      <div className="absolute bottom-0 w-full text-white p-4 font-serif z-20 bg-gradient-to-t from-black/70 via-transparent">
        <h5 className="font-['Rose_Velt_Personal_Use_Only'] font-bold mb-2">
          {product.title || product.name}
        </h5>
        <p className="text-sm">
          {product.desc || product.description}
        </p>
      </div>
    </div>
  );

  // For mobile slider items, we don't include the outer col div
  if (isMobile) {
    return (
      <>
        <style jsx global>{`
          /* Aggressively hide scrollbars and scrollbar buttons inside modal-scroll while keeping scrolling functional */
          .modal-scroll,
          .modal-scroll * {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }

          /* WebKit (Chrome, Safari, Edge Chromium) - hide track, thumb and buttons */
          .modal-scroll::-webkit-scrollbar,
          .modal-scroll *::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }
          .modal-scroll::-webkit-scrollbar-track,
          .modal-scroll *::-webkit-scrollbar-track {
            background: transparent !important;
          }
          .modal-scroll::-webkit-scrollbar-thumb,
          .modal-scroll *::-webkit-scrollbar-thumb {
            background: transparent !important;
          }
          .modal-scroll::-webkit-scrollbar-button,
          .modal-scroll *::-webkit-scrollbar-button {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
          }
        `}</style>
        {mobileCard}
        
        {/* Shlok Modal */}
        {renderModal(
          openModal1,
          () => setOpenModal1(false),
          'Shlok Meaning',
          <>
            {product?.shlok?.shlokText && (
              <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">
                {product.shlok.shlokText}
              </p>
            )}
            {product?.shlok?.shlokMeaning && (
              <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
                {product.shlok.shlokMeaning}
              </p>
            )}
            {!product?.shlok?.shlokText && !product?.shlok?.shlokMeaning && (
              <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
                No shlok information available.
              </p>
            )}
          </>
        )}
        
        {/* Benefits Modal */}
        {renderModal(
          benefits,
          () => setBenefits(false),
          'Ingredients',
          <>
            {product?.ingredients ? (
              <div className="mb-4">
                <p className="text-center font-avenir-400 text-[14px] leading-[20px] text-[#191919]">
                  {product.ingredients}
                </p>
              </div>
            ) : (
              <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
                No ingredients listed.
              </p>
            )}
            <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] py-[10px]">
              Benefits
            </h6>
            {product?.benefits ? (
              <div>
                <p className="text-center font-avenir-400 text-[14px] leading-[20px] text-[#191919]">
                  {product.benefits}
                </p>
              </div>
            ) : (
              <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
                No benefits listed.
              </p>
            )}
          </>
        )}
      </>
    );
  }

  // Desktop version with full column wrapper and button/price section
  return (
    <>
      <style jsx global>{`
        /* Aggressively hide scrollbars and scrollbar buttons inside modal-scroll while keeping scrolling functional */
        .modal-scroll,
        .modal-scroll * {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* WebKit (Chrome, Safari, Edge Chromium) - hide track, thumb and buttons */
        .modal-scroll::-webkit-scrollbar,
        .modal-scroll *::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }
        .modal-scroll::-webkit-scrollbar-track,
        .modal-scroll *::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .modal-scroll::-webkit-scrollbar-thumb,
        .modal-scroll *::-webkit-scrollbar-thumb {
          background: transparent !important;
        }
        .modal-scroll::-webkit-scrollbar-button,
        .modal-scroll *::-webkit-scrollbar-button {
          display: none !important;
          height: 0 !important;
          width: 0 !important;
        }
      `}</style>
      <div className={`w-full ${className}`} style={style}>
        <div className="w-full max-w-[634px]">
          <div className="relative rounded-[20px] h-[250px] md:h-[433px] overflow-hidden">
          <Image
            src={product.image || product.productImageUrl?.[0] || product.productImageUrl || '/images/home/img3.jpg'}
            fill
            alt={product.name || product.title || product.productTitle || 'Product'}
            className="rounded-[20px] object-cover"
          />

          {/* Gradient overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 w-full h-[120px] md:h-[206px]"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }}
          />

          {/* Top bar: logo + shloka / button */}
          <div className="absolute top-0 w-full z-10 p-[15px] md:p-[30px]">
            <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] md:flex-row flex-col">
              <div className="flex items-center gap-[10px] md:gap-[14px]">
                <button onClick={() => onShlokClick ? onShlokClick(product) : setOpenModal1(true)}>
                  <Image 
                    src={product.logo || '/images/home/lag.svg'} 
                    alt="logo" 
                    width={30} 
                    height={30} 
                    className="object-contain cursor-pointer" 
                  />
                </button>
                <h6 className="font-avenir-400 text-[10px] md:text-[12px] text-[#363636] max-w-[200px]">
                  {product?.shlok?.shlokText || product.shloka || product.sanskrit || ''}
                </h6>
              </div>
              {showTag && (
                <button 
                  onClick={() => onBenefitsClick ? onBenefitsClick(product) : setBenefits(true)} 
                  className="bg-[#3030304A] font-avenir-400 text-[12px] md:text-[14px] text-[#FFFFFF] py-[6px] px-[14px] md:py-[10px] md:px-[22px] rounded-full"
                >
                  Ingredients & Benefits
                </button>
              )}
            </div>
          </div>

          {/* Bottom content over image */}
          <div className="absolute bottom-0 w-full z-10 p-[15px] md:p-[30px]">
            <h6 className="font-rose font-[400] text-[18px] md:text-[32px] text-[#FFFFFF] pb-[6px]">
              {product.name || product.title || product.productTitle}
            </h6>
            <p className="font-avenir-400 text-[12px] md:text-[20px] text-[#FFFFFF]">
              {product.desc || product.description || product.productDescription}
            </p>
          </div>
        </div>

        {/* Bottom Section - Match feature products page exactly */}
        <div className="flex justify-between md:items-center items-start md:gap-0 gap-[10px] flex-row py-[18px]">
          <div className="flex gap-[6px] md:flex-row flex-col items-start w-full">
            <div className="w-full md:w-auto flex flex-col gap-[10px]">
              <Link href={`/products/${product.id || product._id || '1'}`}>
                <button className="font-avenir-400 cursor-pointer w-full md:max-w-[206px] text-[12px] md:text-[18px] text-[#FFFFFF] py-[8px] md:py-[12px] px-[10px] md:px-[30px] bg-[#BA7E38] rounded-full border border-[#BA7E38] hover:bg-transparent hover:text-[#BA7E38] transition-all">
                  VIEW PRODUCT
                </button>
              </Link>
            </div>
            <div className="flex gap-[10px]">
              <CartButton productId={product.id || product._id} />
              <WishlistButton productId={product.id || product._id} />
              {product?.amazonLink && (
                <button 
                  onClick={() => window.open(product.amazonLink, '_blank')}
                  className="border border-[#6a5013] px-3 py-3 rounded-full transition-all flex items-center justify-center cursor-pointer"
                  aria-label="Buy from Amazon"
                  title="Buy from Amazon"
                >
                  <Image src="/images/amazon.svg" alt="Amazon" height={35} width={35} className="object-cover md:h-[30px] md:w-[30px]" />
                </button>
              )}
            </div>
          </div>
          <div className="text-right w-full md:max-w-[170px]">
            <h6 className="font-avenir-800 text-[20px] md:text-[24px] text-[#000000]">
              ₹{product.price || product.salePrice || '—'}
            </h6>
            {(product.regularPrice || product.oldPrice) && (product.salePrice || product.price) && (product.regularPrice > product.salePrice || product.oldPrice > product.price) && (
              <p className="font-avenir-400 text-[14px] md:text-[18px] text-[#00000099]">
                Get{" "}
                {Math.round(
                  ((product.regularPrice || product.oldPrice) - (product.salePrice || product.price)) / 
                  (product.regularPrice || product.oldPrice) * 100
                )}
                % OFF &nbsp;
                <span className="line-through">₹{product.regularPrice || product.oldPrice}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Shlok Modal */}
      {renderModal(
        openModal1,
        () => setOpenModal1(false),
        'Shlok Meaning',
        <>
          {product?.shlok?.shlokText && (
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C] max-w-[260px] pb-[30px] w-full mx-auto">
              {product.shlok.shlokText}
            </p>
          )}
          {product?.shlok?.shlokMeaning && (
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
              {product.shlok.shlokMeaning}
            </p>
          )}
          {!product?.shlok?.shlokText && !product?.shlok?.shlokMeaning && (
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
              No shlok information available.
            </p>
          )}
        </>
      )}
      
      {/* Benefits Modal */}
      {renderModal(
        benefits,
        () => setBenefits(false),
        'Ingredients',
        <>
          {product?.ingredients ? (
            <div className="mb-4">
              <p className="text-center font-avenir-400 text-[14px] leading-[20px] text-[#191919]">
                {product.ingredients}
              </p>
            </div>
          ) : (
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
              No ingredients listed.
            </p>
          )}
          <h6 className="text-center font-rose text-[24px] font-[400] text-[#4C0A2E] py-[10px]">
            Benefits
          </h6>
          {product?.benefits ? (
            <div>
              <p className="text-center font-avenir-400 text-[14px] leading-[20px] text-[#191919]">
                {product.benefits}
              </p>
            </div>
          ) : (
            <p className="text-center font-avenir-400 text-[16px] leading-[20px] text-[#191919]">
              No benefits listed.
            </p>
          )}
        </>
      )}
      </div>
    </>
  );
};

export default ProductCard;