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
   * Get checkout preview — shows order summary grouped by seller before payment
   * @param {number|null} addressId - Optional address ID for real Wolt shipping calculation
   * @returns {Promise} Checkout preview data with sellers, items and totals
   */
  getCheckoutPreview: async (addressId = null) => {
    try {
      const url = addressId
        ? `/orders/checkout-preview?address_id=${addressId}`
        : "/orders/checkout-preview";
      const response = await api.get(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching checkout preview:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch checkout preview",
      };
    }
  },

  /**
   * Submit checkout order
   * @param {Object} orderData - Order data: { payment_method, address_id, note? }
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
