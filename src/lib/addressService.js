import { api } from "./axios/api";

/**
 * Address service for handling user address CRUD operations
 */
export const addressService = {
  /**
   * Get all user addresses
   * @returns {Promise<Object>} Addresses response with pagination
   */
  async getAddresses() {
    try {
      const response = await api.get("/profile/addresses/load");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Get addresses error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to load addresses",
      };
    }
  },

  /**
   * Add new address
   * @param {Object} addressData - Address data
   * @returns {Promise<Object>} Add address response
   */
  async addAddress(addressData) {
    try {
      const response = await api.post("/profile/addresses/add", {
        address_type_id: addressData.address_type_id,
        city_id: addressData.city_id,
        address_line_1: addressData.address_line_1,
        address_line_2: addressData.address_line_2,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        phone: addressData.phone,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Add address error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to add address",
      };
    }
  },

  /**
   * Update existing address
   * @param {number} addressId - Address ID to update
   * @param {Object} addressData - Updated address data
   * @returns {Promise<Object>} Update address response
   */
  async updateAddress(addressId, addressData) {
    try {
      const response = await api.post(
        `/profile/addresses/update/${addressId}`,
        {
          address_type_id: addressData.address_type_id,
          city_id: addressData.city_id,
          address_line_1: addressData.address_line_1,
          address_line_2: addressData.address_line_2,
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          phone: addressData.phone,
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Update address error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update address",
      };
    }
  },

  /**
   * Delete address
   * @param {number} addressId - Address ID to delete
   * @returns {Promise<Object>} Delete address response
   */
  async deleteAddress(addressId) {
    try {
      const response = await api.delete(
        `/profile/addresses/delete/${addressId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Delete address error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete address",
      };
    }
  },

  /**
   * Set default address
   * @param {number} addressId - Address ID to set as default
   * @returns {Promise<Object>} Set default address response
   */
  async setDefaultAddress(addressId) {
    try {
      const response = await api.post(
        `/profile/addresses/set-default/${addressId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Set default address error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to set default address",
      };
    }
  },
};

export default addressService;

