import api from "./api";


export const login = async (email, password) => {
  try {
    const response = await api.post("user/signin", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get("product/category/all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductsByCategory = async (slug) => {
  try {
    const response = await api.get(`/product/category/${slug}`);
    return response.data; // array of products
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFaqs = async () => {
  try {
    const response = await api.get("faq/all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await api.get("product/all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getUserCart = async () => {
  try {
    const response = await api.get("user/cart");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAddress = async (addressData) => {
  try {
    // ensure we send a predictable shape the backend accepts
    const payload = addressData && addressData.shippingAddress ? addressData : { shippingAddress: addressData };
    console.debug('updateAddress payload:', payload);
    const response = await api.post("user/address/update", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("product/get/featured");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api.get(`product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRelatedProducts = async (productId, limit = 4) => {
  try {
    const response = await api.get(`product/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error.response?.data || error.message;
  }
};


export const addToWishlist = async (productId, varientId = "") => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // Logged-in user - call server API
      const response = await api.post("/user/wishlist", {
        productId,
        varientId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Also update localStorage for consistency
      const wishlistData = response.data?.data || {};
      let localWishlist = [];
      try {
        const stored = localStorage.getItem("wishlist");
        localWishlist = stored ? JSON.parse(stored) : [];
      } catch (e) {
        localWishlist = [];
      }
      
      // Add to local if not exists
      const exists = localWishlist.some(item => 
        (item.product?._id || item.product) === productId
      );
      if (!exists) {
        localWishlist.push({
          _id: wishlistData._id,
          product: productId,
          variant: varientId || null,
          user: wishlistData.user
        });
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
      }

      return response.data;
    } else {
      // Guest user - add to localStorage only
      let localWishlist = [];
      try {
        const stored = localStorage.getItem("wishlist");
        localWishlist = stored ? JSON.parse(stored) : [];
      } catch (e) {
        localWishlist = [];
      }

      // Check if already exists
      const exists = localWishlist.some(item => 
        (item.product?._id || item.product) === productId
      );

      if (exists) {
        throw new Error("Item already exists in wishlist");
      }

      // Add new item
      const newItem = {
        _id: `guest_${Date.now()}`,
        product: productId,
        variant: varientId || null,
        user: null,
        createdAt: new Date().toISOString()
      };

      localWishlist.push(newItem);
      localStorage.setItem("wishlist", JSON.stringify(localWishlist));
      
      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wishlist',
        newValue: JSON.stringify(localWishlist),
        url: window.location.href
      }));

      return {
        status: "success",
        data: newItem
      };
    }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // Logged-in user - call server API
      const response = await api.delete(`/user/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Also update localStorage
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        let localWishlist = JSON.parse(stored);
        localWishlist = localWishlist.filter(item => 
          (item.product?._id || item.product) !== productId
        );
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
      }

      return response.data;
    } else {
      // Guest user - remove from localStorage
      const stored = localStorage.getItem("wishlist");
      if (!stored) {
        throw new Error("Wishlist not found");
      }

      let localWishlist = JSON.parse(stored);
      const filtered = localWishlist.filter(item => 
        (item.product?._id || item.product) !== productId
      );

      localStorage.setItem("wishlist", JSON.stringify(filtered));
      
      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wishlist',
        newValue: JSON.stringify(filtered),
        url: window.location.href
      }));

      return {
        status: "success",
        data: { message: "Item removed from wishlist" }
      };
    }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getWishlistByUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // Logged-in user - fetch from server
      const response = await api.get("/user/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } else {
      // Guest user - fetch from localStorage
      const stored = localStorage.getItem("wishlist");
      let localWishlist = stored ? JSON.parse(stored) : [];
      
      // Clean up old format (if wishlist has string items instead of objects)
      localWishlist = localWishlist.filter(item => {
        // If item is a string (old format), remove it
        if (typeof item === 'string') {
          console.warn('Found old format wishlist item (string), removing:', item);
          return false;
        }
        // Keep only proper object format items
        return item && typeof item === 'object' && item.product;
      });
      
      // Save cleaned wishlist back to localStorage
      localStorage.setItem("wishlist", JSON.stringify(localWishlist));

      // If empty after cleanup, return empty array
      if (localWishlist.length === 0) {
        return {
          status: "success",
          data: []
        };
      }

      // For guest users, we need to fetch product details for each item
      // This requires calling the product API for each productId
      const productsWithDetails = await Promise.all(
        localWishlist.map(async (item) => {
          try {
            const productId = item.product?._id || item.product;
            
            if (!productId) {
              console.error('Invalid wishlist item, missing product ID:', item);
              return null;
            }
            
            console.log(`Fetching product details for: ${productId}`);
            
            // Fetch product details
            const productResponse = await api.get(`/product/${productId}`);
            console.log(`Product response for ${productId}:`, productResponse);
            
            // The backend might return data in different structures
            // Try multiple paths to get the product data
            let productData = productResponse.data?.data?.product || 
                            productResponse.data?.data || 
                            productResponse.data?.product ||
                            productResponse.data;
            
            console.log(`Extracted product data for ${productId}:`, productData);
            
            // If productData is still wrapped, try to unwrap it
            if (productData && productData.product && !productData.productTitle) {
              productData = productData.product;
            }
            
            return {
              ...item,
              product: productData // Replace productId with full product object
            };
          } catch (err) {
            console.error(`Failed to fetch product ${item.product}:`, err);
            return null; // Return null if fetch fails
          }
        })
      );
      
      // Filter out null items (failed fetches)
      const validProducts = productsWithDetails.filter(item => item !== null);

      return {
        status: "success",
        data: validProducts
      };
    }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addToCart = async (productId: string, varientId = "", quantity = 1) => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // Logged-in user - call server API
      const response = await api.post(
        "/user/cart",
        {
          productId,
          varientId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update localStorage with server response for consistency
      if (response?.data?.cart?.products) {
        localStorage.setItem("userCart", JSON.stringify(response.data.cart.products));
      }

      return response.data;
    } else {
      // Guest user - handle locally
      // Get product details to store in localStorage
  const productDetails = await getProductById(productId);
  console.log('productDetails at line 139:', JSON.stringify(productDetails));
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("userCart");
      let cartData = existingCart ? JSON.parse(existingCart) : [];

      // Ensure cartData is always an array (handle legacy single object format)
      if (!Array.isArray(cartData)) {
        cartData = [cartData];
      }

      // Check if product already exists
      const existingProductIndex = cartData.findIndex(
        item => item.productId?._id === productId && item.varientId === varientId
      );

      if (existingProductIndex !== -1) {
        // Product exists - update quantity instead of returning error
        cartData[existingProductIndex].quantity = quantity;
        localStorage.setItem("userCart", JSON.stringify(cartData));
        return {
          status: "success",
          data: { products: cartData },
          message: "Cart updated"
        };
      } else {
        // Add new product with details needed for display
        cartData.push({
          productId: {
            _id: productId,
            productTitle: productDetails?.data?.product?.productTitle || productDetails?.data?.product?.title || "",
            salePrice: productDetails?.data?.product?.salePrice || productDetails?.data?.product?.price || 0,
            productImageUrl: productDetails?.data?.product?.productImageUrl || productDetails?.data?.product?.images || []
          },
          varientId: varientId,
          quantity: quantity
        });
        // Save to localStorage
        localStorage.setItem("userCart", JSON.stringify(cartData));

        return {
          status: "success",
          data: { products: cartData },
          message: "Item added to cart"
        };
      }
    }
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    throw error.response?.data || error.message;
  }
};

// New function to merge guest cart with user cart after login
export const mergeGuestCartWithUserCart = async () => {
  try {
    const localCart = localStorage.getItem("userCart");
    if (!localCart) return;

    const cartData = JSON.parse(localCart);
    if (!cartData.length) return;

    // Add each local cart item to server cart
    for (const item of cartData) {
      try {
        await addToCart(
          item.productId._id,
          item.varientId,
          item.quantity
        );
      } catch (err) {
        console.error("Error adding item to server cart:", err);
      }
    }

    // Clear local cart after successful merge
    localStorage.removeItem("userCart");
  } catch (error) {
    console.error("Error merging carts:", error);
  }
};

export const getCartDetails = async () => {
  try {
    const response = await api.get("/user/cart");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeUserCart = async ({ productId, varientId = "", quantity }) => {
  try {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Logged-in user - call server API
      const response = await api.post(
        "user/cart/remove",
        { productId, varientId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Also update localStorage for consistency
      const localCart = localStorage.getItem("userCart");
      if (localCart) {
        let cartData = JSON.parse(localCart);
        if (!Array.isArray(cartData)) cartData = [cartData];
        
        // Remove item from local cart
        const filtered = cartData.filter(item => {
          const itemProductId = item.productId?._id || item.productId;
          const itemVarientId = item.varientId || "";
          return !(itemProductId == productId && itemVarientId == varientId);
        });
        
        localStorage.setItem("userCart", JSON.stringify(filtered));
      }
      
      return response.data;
    } else {
      // Guest user - remove from localStorage only
      const localCart = localStorage.getItem("userCart");
      if (!localCart) {
        throw new Error("Cart not found");
      }
      
      let cartData = JSON.parse(localCart);
      if (!Array.isArray(cartData)) cartData = [cartData];
      
      // Remove item
      const filtered = cartData.filter(item => {
        const itemProductId = item.productId?._id || item.productId;
        const itemVarientId = item.varientId || "";
        return !(itemProductId == productId && itemVarientId == varientId);
      });
      
      localStorage.setItem("userCart", JSON.stringify(filtered));
      
      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userCart',
        newValue: JSON.stringify(filtered),
        url: window.location.href
      }));
      
      return { status: "success", data: { products: filtered } };
    }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendOTP = async (phoneNumber) => {
  try {
    const response = await api.post("auth/send-otp", { phoneNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await api.post("auth/verify-otp", { phoneNumber, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resendOTP = async (phoneNumber) => {
  try {
    const response = await api.post("auth/resend-otp", { phoneNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await api.get("blog/all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`blog/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await api.get("user/details");
    // Backend wraps payload as { status, data: <user> }
    // Return the inner user object to make callers simpler
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUser = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put('user/updateuser', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('user/order/all');
    // backend probably returns { status, data: { orders: [...] } } or similar
    console.log(response.data);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const placeOrder = async (orderData) => {
  try {
    const response = await api.post("user/order/place", orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createRazorpayOrder = async (orderData) => {
  try {
    const response = await api.post("rzp/create-order", orderData);
    // backend returns { status: 'success', data: { order } }
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyRazorpayPayment = async (verificationData) => {
  try {
    const response = await api.post("rzp/payment-verification", verificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DEPRECATED: Guest checkout is no longer used
// All users must login before placing orders
// export const placeGuestOrder = async (guestOrderData) => {
//   try {
//     const response = await api.post("guest/order/place", guestOrderData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// Merge guest cart and wishlist data with server on login
export const mergeGuestDataOnLogin = async (token: string) => {
  try {
    console.log("Starting guest data merge...");
    
    // Merge Cart
    const guestCart = localStorage.getItem("userCart");
    if (guestCart) {
      const cartItems = JSON.parse(guestCart);
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        console.log(`Merging ${cartItems.length} cart items...`);
        
        // Add each cart item to server (backend handles duplicates)
        for (const item of cartItems) {
          try {
            const productId = item.productId?._id || item.productId;
            const varientId = item.varientId || "";
            const quantity = item.quantity || 1;
            
            await api.post(
              "/user/cart/",
              { productId, varientId, quantity },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (err) {
            console.error("Failed to merge cart item:", err);
            // Continue with other items even if one fails
          }
        }
        
        console.log("Cart merge complete");
      }
    }

    // Merge Wishlist
    const guestWishlist = localStorage.getItem("wishlist");
    if (guestWishlist) {
      const wishlistItems = JSON.parse(guestWishlist);
      if (Array.isArray(wishlistItems) && wishlistItems.length > 0) {
        console.log(`Merging ${wishlistItems.length} wishlist items...`);
        
        // Add each wishlist item to server
        for (const item of wishlistItems) {
          try {
            const productId = item.product?._id || item.product;
            const variantId = item.variant || "";
            
            await api.post(
              "/user/wishlist",
              { productId, varientId: variantId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (err) {
            console.error("Failed to merge wishlist item:", err);
            // Continue with other items even if one fails
          }
        }
        
        console.log("Wishlist merge complete");
      }
    }

    console.log("Guest data merged successfully");
  } catch (error) {
    console.error("Failed to merge guest data:", error);
    // Don't throw - we don't want login to fail if merge fails
  }
};

// Clear all user data on logout (start fresh)
export const clearUserDataOnLogout = () => {
  try {
    console.log("Clearing user data on logout...");
    
    // Clear authentication
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear cart and wishlist (start fresh)
    localStorage.removeItem("userCart");
    localStorage.removeItem("wishlist");
    
    // Dispatch storage events for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userCart',
      newValue: null,
      url: window.location.href
    }));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'wishlist',
      newValue: null,
      url: window.location.href
    }));
    
    console.log("User data cleared successfully");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};