"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import * as FaIcons from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import ProductCard from "../../components/ProductCard";
import { useParams } from "next/navigation";
import { getProductById, addToCart, getUserCart, removeUserCart, getRelatedProducts } from '@/api/auth';
import { toast } from 'react-toastify';

const { FaStar, FaStarHalfAlt, FaRegStar, FaMinus, FaPlus } = FaIcons;

// Feature products data (same as in feature-products page)
const featureProducts = [
  {
    id: 1,
    name: "Cosmic Body Oil",
    desc: "Unlock celestial beauty in a bottle. A careful blend of essential oils and natural ingredients that melt into your skin, leaving you nourished and calm.",
    image: "/images/home/img3.jpg",
    logo: "/images/home/lag.svg",
    price: "₹1800",
    oldPrice: "₹2400",
    discount: "Get 50% OFF",
    rating: 4.5,
    reviewCount: 124,
    availability: "Only 3 in stock",
    stock: 3,
    highlights: [
      "Unlock celestial beauty in a bottle. A careful blend of botanicals for luminous, soft skin.",
      "Handcrafted with responsibly sourced, skin-friendly ingredients.",
      "Suitable for all skin types with heavenly nourishment.",
    ],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ingredients: "Aqua, Glycerin, Sodium Chloride, Prunus Armeniaca Seed Powder, Cocos Nucifera Oil, Butyrospermum Parkii Butter, Tocopherol, Parfum",
    howToUse: "Apply to damp skin in circular motions. Rinse thoroughly with warm water. Use 2-3 times per week for best results.",
    images: ["/images/home/img3.jpg", "/images/home/img8.jpg"],
  },
  {
    id: 2,
    name: "Ayurvedic Face Cream",
    desc: "Infused with saffron and sandalwood, this cream brightens, hydrates, and rejuvenates your skin for a natural glow.",
    image: "/images/home/img8.jpg",
    logo: "/images/home/lag.svg",
    price: "₹950",
    oldPrice: "₹1200",
    discount: "Get 20% OFF",
    rating: 4.3,
    reviewCount: 87,
    availability: "Only 5 in stock",
    stock: 5,
    highlights: [
      "Infused with saffron and sandalwood for natural glow.",
      "Brightens, hydrates, and rejuvenates your skin.",
      "Perfect for all skin types.",
    ],
    description: "Experience the luxury of Ayurvedic skincare with our premium face cream. Enriched with traditional ingredients like saffron and sandalwood, this cream provides deep hydration while promoting a natural, radiant glow.",
    ingredients: "Saffron Extract, Sandalwood Oil, Aloe Vera, Vitamin E, Rose Water, Glycerin, Natural Moisturizers",
    howToUse: "Apply gently on clean face and neck. Massage in circular motions until fully absorbed. Use twice daily for best results.",
    images: ["/images/home/img8.jpg", "/images/home/img3.jpg"],
  },
  {
    id: 3,
    name: "Herbal Hair Elixir",
    desc: "A nourishing blend of bhringraj, amla, and neem that strengthens roots, prevents hair fall, and adds shine.",
    image: "/images/home/img3.jpg",
    logo: "/images/home/lag.svg",
    price: "₹1250",
    oldPrice: "₹1600",
    discount: "Get 22% OFF",
    rating: 4.7,
    reviewCount: 156,
    availability: "Only 4 in stock",
    stock: 4,
    highlights: [
      "Strengthens hair roots and prevents hair fall.",
      "Enriched with bhringraj, amla, and neem.",
      "Adds natural shine and promotes hair growth.",
    ],
    description: "Transform your hair care routine with our potent herbal elixir. This traditional blend combines the power of bhringraj, amla, and neem to nourish your scalp, strengthen hair follicles, and promote healthy hair growth.",
    ingredients: "Bhringraj Extract, Amla Oil, Neem Oil, Coconut Oil, Sesame Oil, Fenugreek Extract, Curry Leaves Extract",
    howToUse: "Apply to scalp and hair roots. Massage gently for 5-10 minutes. Leave for 30 minutes before washing. Use 2-3 times per week.",
    images: ["/images/home/img3.jpg", "/images/home/img8.jpg"],
  },
  {
    id: 4,
    name: "Organic Rose Water",
    desc: "Pure steam-distilled rose water that tones, refreshes, and hydrates your skin naturally.",
    image: "/images/home/img8.jpg",
    logo: "/images/home/lag.svg",
    price: "₹450",
    oldPrice: "₹600",
    discount: "Get 25% OFF",
    rating: 4.2,
    reviewCount: 203,
    availability: "Only 8 in stock",
    stock: 8,
    highlights: [
      "Pure steam-distilled rose water.",
      "Tones, refreshes, and hydrates naturally.",
      "Perfect for all skin types including sensitive skin.",
    ],
    description: "Indulge in the pure essence of roses with our organic rose water. Steam-distilled from fresh rose petals, this natural toner helps balance your skin's pH while providing gentle hydration and a refreshing feel.",
    ingredients: "Pure Rosa Damascena Distillate, Natural Rose Essence",
    howToUse: "Spray directly on face or apply with cotton pad after cleansing. Can be used throughout the day for refreshing. Suitable for daily use.",
    images: ["/images/home/img8.jpg", "/images/home/img3.jpg"],
  },
];

export default function ProductPage({ onAddToCart }) {
  const params = useParams();
  const { id } = params || {};

  const [selectedImage, setSelectedImage] = useState(0);
  const [autoZoomed, setAutoZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [lastUserCartActionAt, setLastUserCartActionAt] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showIngredientsBenefitsModal, setShowIngredientsBenefitsModal] = useState(false);
  const [showShlokModal, setShowShlokModal] = useState(false);
  const [showAmazonModal, setShowAmazonModal] = useState(false);
  
  // Ref to prevent multiple simultaneous cart checks
  const isCheckingCartRef = useRef(false);
  const cartCheckedForProductRef = useRef(null);

  useEffect(() => {
    // gentle auto-zoom after mount
    const t = setTimeout(() => setAutoZoomed(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  // fetched product from backend
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  
  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Find product by ID from featureProducts array (fallback)
  const fallbackProduct = featureProducts.find((p) => p.id === parseInt(id));

    // Use backend field names directly. The backend returns either the product object
    // or an envelope like { product, variants, images } — prefer the `product` field if present.
    const backendRaw = fetchedProduct?.product || fetchedProduct;

    const product = backendRaw
      ? {
          id: backendRaw._id,
          // Backend fields (use these names exactly): productTitle, productDescription, productImageUrl, salePrice, regularPrice
          name: backendRaw.productTitle,
          desc: backendRaw.productDescription,
          images: Array.isArray(backendRaw.productImageUrl) ? backendRaw.productImageUrl : (backendRaw.productImageUrl ? [backendRaw.productImageUrl] : []),
          // Availability/stock are often provided on variants; show basic status from isActive
          availability: backendRaw.isActive ? 'In Stock' : 'Unavailable',
          stock: null,
          price: backendRaw.salePrice ?? backendRaw.regularPrice ?? 0,
          oldPrice: backendRaw.salePrice ? backendRaw.regularPrice : null,
          rating: backendRaw.rating ?? 4.5,
          reviewCount: backendRaw.reviewCount ?? 0,
          highlights: backendRaw.highlights ?? [],
          ingredients: backendRaw.ingredients ?? '',
          benefits: backendRaw.benefits ?? '',
          shlok: backendRaw.shlok ?? { shlokText: '', shlokMeaning: '' },
          amazonLink: backendRaw.amazonLink ?? '',
          howToUse: backendRaw.careHandling ?? backendRaw.howToUse ?? '',
          image: (Array.isArray(backendRaw.productImageUrl) && backendRaw.productImageUrl[0]) || '/images/home/img3.jpg',
        }
      : fallbackProduct;

  // Price formatting helper: format numbers as INR, otherwise return as-is
  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "number") {
      try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);
      } catch (e) {
        return val;
      }
    }
    // if it's already a string (like "₹1800") return as-is
    return val;
  };

  const priceDisplay = formatCurrency(product?.price);
  const oldPriceDisplay = product?.oldPrice ? formatCurrency(product.oldPrice) : null;

  useEffect(() => {
    // fetch real product by id
    const load = async () => {
      if (!id) return;
      setLoadingProduct(true);
      try {
        const resp = await getProductById(id);
        const data = resp?.data || resp;
        setFetchedProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setFetchedProduct(null);
      } finally {
        setLoadingProduct(false);
      }
    };

    load();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!id) return;
      
      setLoadingRelated(true);
      try {
        const resp = await getRelatedProducts(id, 4);
        const products = resp?.data?.products || resp?.products || [];
        
        // Transform backend products to match frontend format
        const transformedProducts = products.map(p => ({
          id: p._id,
          name: p.productTitle,
          desc: p.productDescription,
          image: Array.isArray(p.productImageUrl) ? p.productImageUrl[0] : p.productImageUrl || '/images/home/img3.jpg',
          images: Array.isArray(p.productImageUrl) ? p.productImageUrl : [p.productImageUrl || '/images/home/img3.jpg'],
          price: p.salePrice ?? p.regularPrice ?? 0,
          oldPrice: p.salePrice ? p.regularPrice : null,
          rating: p.rating ?? 4.5,
          reviewCount: p.reviewCount ?? 0,
          availability: p.isActive ? 'In Stock' : 'Unavailable',
          stock: p.stock || null,
          highlights: p.highlights || [],
          ingredients: p.ingredients || '',
          benefits: p.benefits || '',
          shlok: p.shlok || { shlokText: '', shlokMeaning: '' },
          amazonLink: p.amazonLink || '',
          howToUse: p.careHandling || p.howToUse || '',
        }));
        
        setRelatedProducts(transformedProducts);
      } catch (err) {
        console.error('Failed to load related products:', err);
        // Fallback to dummy products if API fails
        setRelatedProducts(
          featureProducts
            .filter((p) => p.id !== parseInt(id))
            .slice(0, 4)
        );
      } finally {
        setLoadingRelated(false);
      }
    };

    loadRelatedProducts();
  }, [id]);

  // Detect if product is already in cart (server-side for logged-in, or localStorage for guests)
  useEffect(() => {
    const checkCart = async () => {
      // Prevent multiple simultaneous checks
      if (isCheckingCartRef.current) return;
      
      // If we already checked this product, don't check again unless user action triggers it
      if (cartCheckedForProductRef.current === id && !lastUserCartActionAt) return;
      
      // If user recently (within 3s) interacted with cart on this page, skip re-check to avoid UI flicker
      if (lastUserCartActionAt && Date.now() - lastUserCartActionAt < 3000) {
        return;
      }

      isCheckingCartRef.current = true;
      setCheckingCart(true);
      
      try {
        // Try server cart first (for logged-in users)
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            const serverCart = await getUserCart();
            const products = serverCart?.data?.products || serverCart?.products || serverCart;
            if (Array.isArray(products)) {
              const found = products.find(p => (p.productId?._id || p.productId) == id);
              if (found) {
                setInCart(true);
                setQuantity(found.quantity || found.qty || 1);
                cartCheckedForProductRef.current = id;
                return;
              }
            }
          } catch (e) {
            // ignore server cart errors, fall back to local
            console.error('Server cart check failed:', e);
          }
        }

        // Check guest/local cart (for guests or as fallback)
        const raw = localStorage.getItem('userCart');
        let cartData = [];
        if (raw) {
          try { cartData = JSON.parse(raw); } catch (e) { cartData = []; }
        }
        if (!Array.isArray(cartData)) cartData = [cartData];

        const foundLocal = cartData.find(item => (item.productId?._id || item.productId) == id);
        if (foundLocal) {
          setInCart(true);
          setQuantity(foundLocal.quantity || 1);
        } else {
          setInCart(false);
          setQuantity(1);
        }
        
        cartCheckedForProductRef.current = id;
      } catch (err) {
        console.error('Error checking cart status', err);
        setInCart(false);
        setQuantity(1);
      } finally {
        setCheckingCart(false);
        isCheckingCartRef.current = false;
      }
    };

    // only run check once product id is available
    if (id) {
      checkCart();
    }
  }, [id, lastUserCartActionAt]);

  // Cross-tab sync: listen to localStorage changes and refresh cart state
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only respond to userCart changes
      if (e.key !== 'userCart') return;

      // Parse new cart data
      let cartData = [];
      if (e.newValue) {
        try { cartData = JSON.parse(e.newValue); } catch (err) { cartData = []; }
      }
      if (!Array.isArray(cartData)) cartData = [cartData];

      // Check if current product is in the updated cart
      const found = cartData.find(item => (item.productId?._id || item.productId) == id);
      if (found) {
        setInCart(true);
        setQuantity(found.quantity || 1);
      } else {
        setInCart(false);
        setQuantity(1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [id]);

  // Use product images or fallback images
  const galleryImages = product?.images || ["/card21.png", "/card11.png"];

  // Gallery helpers use galleryImages length (safer)
  const goPrev = () => setSelectedImage((i) => Math.max(0, i - 1));
  const goNext = () => setSelectedImage((i) => Math.min(galleryImages.length - 1, i + 1));

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;

    for (let i = 0; i < full; i++) {
      stars.push(<IoMdStar key={i} className="text-[#DAA520] text-2xl" />);
    }

    if (half) {
      // show one more star as a faded star for "half"
      stars.push(<IoMdStar key="half" className="text-[#DAA520] opacity-60 text-2xl" />);
    }

    for (let i = 0; i < 5 - Math.ceil(rating); i++) {
      stars.push(<IoMdStar key={`e-${i}`} className="text-gray-300 text-2xl" />);
    }

    return stars;
  };

  const handleQuantityChange = (change) => setQuantity((prev) => Math.max(1, prev + change));

  // Debounced cart update function to prevent API spam
  const updateCartQuantity = async (newQuantity) => {
    try {
      await addToCart(product?.id || id, "", newQuantity);
      // toast.success('Cart updated');
    } catch (err) {
      console.error('Failed to update cart quantity', err);
      toast.error('Failed to update cart');
      // Revert quantity on error
      const serverCart = await getUserCart().catch(() => null);
      if (serverCart?.data?.products) {
        const found = serverCart.data.products.find(p => (p.productId?._id || p.productId) == (product?.id || id));
        if (found) setQuantity(found.quantity || 1);
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#faf9f6" }}>
        <div className="text-center p-6">
          <h2 className="text-2xl font-medium mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you are looking for does not exist.</p>
          <Link href="/feature-products" className="inline-block bg-[#4C0A2E] text-white px-4 py-2 rounded">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[120px]">
      {/* Product Details */}
      <div className="max-w-[1400px] mx-auto pb-4 pt-6 px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full mx-auto">
          {/* Left Side - Images area */}
          <div className="w-full lg:w-[65%] flex flex-col lg:flex-row gap-3 lg:gap-4">
            {/* Thumbnails - show after main image on mobile, vertical on desktop */}
            <div
              className="order-2 lg:order-1 flex flex-row lg:flex-col gap-2 lg:gap-3 justify-center lg:justify-start overflow-x-auto lg:overflow-visible px-2 lg:px-0"
              aria-hidden="true"
            >
              {galleryImages.map((img, idx) => (
                <button
                  key={img + idx}
                  className={`relative w-20 h-14 lg:w-28 lg:h-23 rounded-2xl overflow-hidden shadow-md transition-all duration-200 flex-shrink-0 ${
                    selectedImage === idx ? "shadow-lg ring-2 ring-[#4C0A2E]" : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img} alt={`Product thumbnail ${idx + 1}`} width={120} height={75} className="w-full h-full object-cover" />
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 inset-0 pointer-events-none opacity-100"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%)" }}
                  />
                </button>
              ))}
            </div>

            {/* Main image - shows first on mobile */}
            <div className="order-1 lg:order-2 w-full lg:w-[75%] max-w-[680px] aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8E5D4] mx-auto lg:mx-0 relative group">
              <Image
                src={galleryImages[selectedImage]}
                alt={product?.name || "Product"}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                className={`object-cover object-center transform transition-transform duration-[1200ms] ease-in-out ${
                  autoZoomed ? "scale-105" : "scale-100"
                } group-hover:scale-110`}
                priority
              />

              {/* optional prev/next controls - visible on mobile */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 lg:hidden">
                <button
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow"
                >
                  ‹
                </button>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 lg:hidden">
                <button
                  onClick={goNext}
                  aria-label="Next image"
                  className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Product Information */}
          <div className="w-full lg:w-[38%] lg:pl-4 px-2 lg:px-0">
            {/* Availability */}
            <div className="mb-2">
              <span className="text-gray-600 text-sm">Availability: {product?.availability}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-black text-xl sm:text-2xl lg:text-3xl font-normal mb-2 leading-tight uppercase font-avenir-400">
              {product.name}
            </h1>

            {/* Rating */}
            {/* <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">{renderStars(product.rating)}</div>
              <div className="text-sm text-gray-600">({product.reviewCount})</div>
            </div> */}

            {/* Product Description */}
            <div className="mb-6">
              <p className="text-black text-sm sm:text-base leading-relaxed mb-2 font-avenir-400">{product?.desc}</p>
              <p className="text-gray-700 text-sm">मुग्धे! धानुष्कता केयमपूर्वा त्वयि दृश्यते यया विध्यसि चेतांसि गुणैरेव न सायकैः</p>
            </div>

            <hr className="border-t border-gray-200 my-4" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Price Section */}
            <div className="mb-6 mt-4 text-left">
              <div className="text-gray-600 text-xs mb-2">INR (incl. of all taxes)</div>
              <div className="text-black text-2xl sm:text-3xl font-normal font-avenir-400">
                {priceDisplay}
                {oldPriceDisplay && (
                  <span className="text-gray-500 text-sm ml-3 line-through">{oldPriceDisplay}</span>
                )}
              </div>
            </div>

            {/* Add to Cart or Quantity Selector */}
            <div className="flex flex-col items-start sm:items-end justify-end gap-3">
              {checkingCart ? (
                <div className="text-sm text-gray-500">Checking cart...</div>
              ) : inCart ? (
                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      if (cartLoading) return; // Prevent multiple clicks
                      
                      // Optimistically update UI
                      const newQ = quantity - 1;
                      
                      if (quantity <= 1) {
                        // Remove from cart if at quantity 1
                        setLastUserCartActionAt(Date.now());
                        cartCheckedForProductRef.current = null; // Allow re-check after user action
                        setCartLoading(true);
                        try {
                          await removeUserCart({ productId: product?.id || id, varientId: "", quantity: 1 });
                          setInCart(false);
                          setQuantity(1);
                          // toast.success('Removed from cart');
                        } catch (err) {
                          console.error('Failed to remove from cart', err);
                          toast.error('Failed to remove from cart');
                        } finally {
                          setCartLoading(false);
                        }
                      } else {
                        // Decrement quantity
                        setQuantity(newQ);
                        setLastUserCartActionAt(Date.now());
                        
                        // Clear existing timer
                        if (debounceTimer) clearTimeout(debounceTimer);
                        
                        // Set new debounced API call (500ms delay)
                        const timer = setTimeout(async () => {
                          setCartLoading(true);
                          await updateCartQuantity(newQ);
                          setCartLoading(false);
                        }, 500);
                        
                        setDebounceTimer(timer);
                      }
                    }}
                    aria-label="decrease quantity"
                    disabled={cartLoading}
                  >
                    <span className="text-xl leading-none font-bold">-</span>
                  </button>

                  <span className="w-20 h-10 border-y border-gray-300 text-center font-medium text-lg flex items-center justify-center">
                    {quantity}
                  </span>

                  <button
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      if (cartLoading) return; // Prevent multiple clicks
                      
                      // Check stock
                      const newQ = quantity + 1;
                      if (product?.stock && newQ > product.stock) {
                        toast.info('Not enough stock');
                        return;
                      }
                      
                      // Optimistically update UI
                      setQuantity(newQ);
                      setLastUserCartActionAt(Date.now());
                      
                      // Clear existing timer
                      if (debounceTimer) clearTimeout(debounceTimer);
                      
                      // Set new debounced API call (500ms delay)
                      const timer = setTimeout(async () => {
                        setCartLoading(true);
                        await updateCartQuantity(newQ);
                        setCartLoading(false);
                      }, 500);
                      
                      setDebounceTimer(timer);
                    }}
                    aria-label="increase quantity"
                    disabled={cartLoading}
                  >
                    <span className="text-xl leading-none font-bold">+</span>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="inline-flex items-center gap-2 bg-[#BA7E38] text-white px-4 py-2 rounded hover:bg-[#a36b2f] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      if (cartLoading) return; // Prevent double clicks
                      
                      setLastUserCartActionAt(Date.now());
                      cartCheckedForProductRef.current = null; // Allow re-check after user action
                      setCartLoading(true);
                      try {
                        const res = await addToCart(product?.id || id, "", quantity);
                        // toast.success(res?.message || 'Added to cart');
                        setInCart(true);
                      } catch (err) {
                        console.error('Error adding to cart', err);
                        toast.error('Failed to add to cart');
                      } finally {
                        setCartLoading(false);
                      }
                    }}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              )}

              {/* Buy from Amazon - border style matching Add to Cart color */}
              {product?.amazonLink && (
                <div>
                  <button
                    onClick={() => window.open(product.amazonLink, '_blank')}
                    aria-label="Buy from Amazon"
                    title="Buy from Amazon"
                    className="inline-flex items-center gap-2 border border-[#BA7E38] text-[#BA7E38] px-4 py-2 rounded hover:bg-[#FFF7ED] transition-all cursor-pointer"
                  >
                    Buy from Amazon
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-6">
              {["Description", "Ingredients"].map((tab) => {
                const key = tab.toLowerCase();
                return (
                  <button
                    key={key}
                    className={`pb-3 text-sm sm:text-base font-medium tracking-wide transition-colors relative ${
                      activeTab === key ? "text-black border-b-2 border-[#4C0A2E]" : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <div className="max-w-4xl mx-auto px-2 sm:px-0">
                <div className="mb-6 text-center">
                  <p
                    className="text-lg sm:text-xl font-medium leading-tight mb-2 pt-[10px]"
                    style={{
                      background: "linear-gradient(90deg, #382801 0%, #382801 35%, #b07a0d 48%, #bc8c12 50%, #b07a0d 52%, #382801 65%, #382801 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    स्निग्धं चारुतरं रम्यं तनुं तन्वङ्गि ते शुभम्
                  </p>
                  <p
                    className="text-lg sm:text-xl font-medium leading-tight"
                    style={{
                      background: "linear-gradient(90deg, #382801 0%, #382801 35%, #b07a0d 48%, #bc8c12 50%, #b07a0d 52%, #382801 65%, #382801 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    सौन्दर्यसारसंपन्नं मृदुं मन्दारसुन्दरम्
                  </p>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed text-center">
                  <p className="text-sm md:text-base mx-auto max-w-3xl font-avenir-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>

                  <p className="text-sm md:text-base mx-auto max-w-3xl font-avenir-400">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="max-w-4xl mx-auto px-2 sm:px-0">
                {product.ingredients && (
                  <div className="mt-4">
                <h4 className="text-lg font-medium mb-4 text-gray-800">Natural Ingredients</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{product.ingredients}</p>
                </div>)}
                {product.benefits && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium mb-2 text-gray-800">Benefits:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{product.benefits}</p>
                  </div>
                )}
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2 text-gray-800">How to Use:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{product.howToUse}</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-4xl mx-auto px-2 sm:px-0">
                <h3 className="text-xl font-medium mb-4 text-gray-800">Customer Reviews</h3>
                <div className="flex justify-center items-center mb-4">
                  <div className="flex mr-3">{renderStars(product.rating)}</div>
                  <span className="text-lg font-medium mr-2">{product.rating}</span>
                  <span className="text-gray-600">({product.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-700">Reviews will be displayed here...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="py-8 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <Image src="/images/home/wrapper.svg" width={44} height={44} alt="decor-left" className="hidden md:block" />
              <h2 className="font-medium mb-0 text-[#4C0A2E] tracking-wide uppercase text-xl md:text-2xl font-['Rose_Velt_Personal_Use_Only']">
                RELATED PRODUCTS
              </h2>
              <Image src="/images/home/wrapper.svg" width={44} height={44} alt="decor-right" className="hidden md:block transform rotate-180" />
            </div>
          </div>

          {loadingRelated ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4C0A2E]"></div>
              <p className="mt-2 text-gray-600">Loading related products...</p>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id ?? rp._id}
                  product={rp}
                  showShloka={true}
                  showTag={true}
                  cardHeight="380px"
                  className="mb-4"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No related products found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showIngredientsBenefitsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#4C0A2E]">Ingredients & Benefits</h3>
                <button
                  onClick={() => setShowIngredientsBenefitsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {product?.ingredients && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Ingredients:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.ingredients}</p>
                </div>
              )}
              {product?.benefits && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Benefits:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.benefits}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showShlokModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#4C0A2E]">Shlok</h3>
                <button
                  onClick={() => setShowShlokModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {product?.shlok?.shlokText && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Sanskrit Shlok:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed font-serif">{product.shlok.shlokText}</p>
                </div>
              )}
              {product?.shlok?.shlokMeaning && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Meaning:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.shlok.shlokMeaning}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAmazonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#4C0A2E]">Buy on Amazon</h3>
                <button
                  onClick={() => setShowAmazonModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">You will be redirected to Amazon to purchase this product.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.open(product.amazonLink, '_blank');
                    setShowAmazonModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#4C0A2E] text-white text-sm font-medium rounded-md hover:bg-[#3a0724] transition-colors"
                >
                  Continue to Amazon
                </button>
                <button
                  onClick={() => setShowAmazonModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
