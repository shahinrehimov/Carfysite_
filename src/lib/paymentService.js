import { api } from "@/lib/axios/api";

export const paymentService = {
  /**
   * Check payment status for an order
   * @param {string} orderUuid - Order UUID
   * @param {string} paymentMethod - Payment method (e.g., 'kapital')
   * @param {string} token - Payment token
   * @returns {Promise} API response
   */
  checkPaymentStatus: async (orderUuid, paymentMethod, token) => {
    try {
      const response = await api.get(
        `/orders/check-payment-status/${orderUuid}/${paymentMethod}/${token}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
