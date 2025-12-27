import axios from "axios";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";

/**
 * Server-side API utility for making requests with proper cookie context
 * This ensures that guest identifiers and auth tokens are included in server-side requests
 */

// Create server-side axios instance
const createServerApiInstance = async () => {
  const cookieStore = await cookies();
  
  const instance = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_PROTOCOL +
      "://" +
      process.env.NEXT_PUBLIC_API_HOST +
      "/api/app",
    timeout: 10000,
  });

  // Request interceptor for server-side requests
  instance.interceptors.request.use(
    async (config) => {
      // Add API token from environment
      const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
      if (apiToken) {
        config.headers["Token"] = apiToken;
      }

      // Add Authorization header if access token exists in cookie
      const accessToken = cookieStore.get("access_token");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken.value}`;
      }

      // Add guest identifier header if exists in cookie
      const guestIdentifier = cookieStore.get("guest_identifier");
      if (guestIdentifier) {
        config.headers["identifier"] = guestIdentifier.value;
      }

      // Set Accept-Language header based on current locale
      if (!config.headers["Accept-Language"]) {
        try {
          const locale = await getLocale();
          config.headers["Accept-Language"] = locale || "en";
        } catch (error) {
          config.headers["Accept-Language"] = "en";
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Server-side API utility functions
 */
export const serverApi = {
  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  get: async (url, config = {}) => {
    const instance = await createServerApiInstance();
    return instance.get(url, config);
  },

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  post: async (url, data = {}, config = {}) => {
    const instance = await createServerApiInstance();
    return instance.post(url, data, config);
  },

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  put: async (url, data = {}, config = {}) => {
    const instance = await createServerApiInstance();
    return instance.put(url, data, config);
  },

  /**
   * PATCH request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  patch: async (url, data = {}, config = {}) => {
    const instance = await createServerApiInstance();
    return instance.patch(url, data, config);
  },

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config options
   * @returns {Promise} Axios response
   */
  delete: async (url, config = {}) => {
    const instance = await createServerApiInstance();
    return instance.delete(url, config);
  },
};

export default serverApi;

