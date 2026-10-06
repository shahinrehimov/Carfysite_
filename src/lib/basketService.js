import { api } from "@/lib/axios/api";

function fitmentBody(fitment) {
  if (!fitment) return {};
  const brandId = fitment.brand_id ?? fitment.brand?.id ?? null;
  const modelId = fitment.brand_model_id ?? fitment.brand_model?.id ?? null;
  const body = {};
  if (brandId) body.brand_id = brandId;
  if (modelId) body.brand_model_id = modelId;
  return body;
}

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
  add: async (productId, quantity = 1, fitment) => {
    try {
      const response = await api.post(`/basket/add/${productId}`, {
        quantity,
        ...fitmentBody(fitment),
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
  remove: async (productId, fitment) => {
    try {
      const response = await api.post(
        `/basket/remove/${productId}`,
        fitmentBody(fitment),
      );
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
  increment: async (productId, fitment) => {
    try {
      const response = await api.post(
        `/basket/increment/${productId}`,
        fitmentBody(fitment),
      );
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
  decrement: async (productId, fitment) => {
    try {
      const response = await api.post(
        `/basket/decrement/${productId}`,
        fitmentBody(fitment),
      );
      return response.data;
    } catch (error) {
      console.error("Error decrementing basket item:", error);
      throw error;
    }
  },
};

export default basketService;

