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



export const addToWishlist = async (productId, varientId = "") => {
  try {
    const token = localStorage.getItem("token"); // ya context/Redux

    const response = await api.post("/user/wishlist", {
      productId,
      varientId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );

    return response.data;
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

      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("userCart");
      let cartData = existingCart ? JSON.parse(existingCart) : [];

      // Check if product already exists
      const existingProductIndex = cartData.findIndex(
        item => item.productId?._id === productId && item.varientId === varientId
      );

      if (existingProductIndex !== -1) {
        // Product exists - increment quantity
        cartData[existingProductIndex].quantity += quantity;
      } else {
        // Add new product with details needed for display
        cartData.push({
          productId: {
            _id: productId,
            productTitle: productDetails.product?.productTitle || "",
            salePrice: productDetails.product?.salePrice || 0,
            productImageUrl: productDetails.product?.productImageUrl || []
          },
          varientId: varientId,
          quantity: quantity
        });
      }

      // Save to localStorage
      localStorage.setItem("userCart", JSON.stringify(cartData));

      return {
        status: "success",
        data: { products: cartData }
      };
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
    const response = await api.post(
      "user/cart/remove",
      { productId, varientId, quantity },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
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