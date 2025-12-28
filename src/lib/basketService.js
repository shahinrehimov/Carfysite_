import { api } from "@/lib/axios/api";

/**
 * Client-side basket service for managing cart operations
 */
export const basketService = {
  /**
   * Load basket items (client-side)
   * @returns {Promise} Basket data
   */
  load: async () => {
    try {
      const response = await api.get("/basket/load");
      return response.data;
    } catch (error) {
      console.error("Error loading basket:", error);
      throw error;
    }
  },

  /**
   * Add product to basket
   * @param {number|string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise} Response data
   */
  add: async (productId, quantity = 1) => {
    try {
      const response = await api.post(`/basket/add/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to basket:", error);
      throw error;
    }
  },

  /**
   * Remove product from basket
   * @param {number|string} productId - Product ID
   * @returns {Promise} Response data
   */
  remove: async (productId) => {
    try {
      const response = await api.post(`/basket/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from basket:", error);
      throw error;
    }
  },

  /**
   * Increment product quantity in basket
   * @param {number|string} productId - Product ID
   * @returns {Promise} Response data
   */
  increment: async (productId) => {
    try {
      const response = await api.post(`/basket/increment/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error incrementing basket item:", error);
      throw error;
    }
  },

  /**
   * Decrement product quantity in basket
   * @param {number|string} productId - Product ID
   * @returns {Promise} Response data
   */
  decrement: async (productId) => {
    try {
      const response = await api.post(`/basket/decrement/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error decrementing basket item:", error);
      throw error;
    }
  },
};

export default basketService;

