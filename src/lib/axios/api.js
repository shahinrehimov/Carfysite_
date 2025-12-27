import axiosInstance from "./index";

/**
 * API utility functions using the configured axios instance
 */
export const api = {
  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  get: (url, config = {}) => axiosInstance.get(url, config),

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),

  /**
   * PATCH request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  patch: (url, data = {}, config = {}) =>
    axiosInstance.patch(url, data, config),

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  delete: (url, config = {}) => axiosInstance.delete(url, config),

  /**
   * Upload file
   * @param {string} url - Upload URL
   * @param {FormData} formData - Form data with file
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  upload: (url, formData, config = {}) => {
    return axiosInstance.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config.headers,
      },
    });
  },

  /**
   * Download file
   * @param {string} url - Download URL
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  download: (url, config = {}) => {
    return axiosInstance.get(url, {
      ...config,
      responseType: "blob",
    });
  },
};

// Export the configured axios instance as well
export { default as axiosInstance } from "./index";

// Export utility functions
export { getCookie, setCookie, removeCookie } from "./utils";
export { getLocale } from "./locale";

