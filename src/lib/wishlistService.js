import { api } from "@/lib/axios/api";

/**
 * Wishlist service for managing favorite products
 */
export const wishlistService = {
  /**
   * Load wishlist items
   * @returns {Promise} Wishlist data
   */
  load: async () => {
    try {
      const response = await api.get("/wishlist/load");
      return response.data;
    } catch (error) {
      console.error("Error loading wishlist:", error);
      throw error;
    }
  },

  /**
   * Add product to wishlist
   * @param {number|string} productId - Product ID
   * @returns {Promise} Response data
   */
  add: async (productId) => {
    try {
      const response = await api.post(`/wishlist/add/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  /**
   * Remove product from wishlist
   * @param {number|string} productId - Product ID
   * @returns {Promise} Response data
   */
  remove: async (productId) => {
    try {
      const response = await api.post(`/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },
};

export default wishlistService;

