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
    const token = localStorage.getItem("token"); // ya context/Redux

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

    return response.data;
  } catch (error: any) {
    console.error("Error adding to cart:", error);
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
