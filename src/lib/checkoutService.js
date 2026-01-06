import { api } from "@/lib/axios/api";

/**
 * Checkout service for managing checkout operations
 */
export const checkoutService = {
  /**
   * Get available payment methods
   * @returns {Promise} Payment methods data
   */
  getPaymentMethods: async () => {
    try {
      const response = await api.get("/payment/methods");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch payment methods",
      };
    }
  },

  /**
   * Submit checkout order
   * @param {Object} orderData - Order data containing payment_method and address_id
   * @returns {Promise} Order submission response
   */
  submitOrder: async (orderData) => {
    try {
      const response = await api.post("/orders/checkout", orderData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error submitting order:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to submit order",
      };
    }
  },
};
