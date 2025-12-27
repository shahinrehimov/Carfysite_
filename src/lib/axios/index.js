import axios from "axios";
import { getCookie } from "./utils";
import { getLocale } from "./locale";

// Create axios instance
const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_PROTOCOL +
    "://" +
    process.env.NEXT_PUBLIC_API_HOST +
    "/api/site",
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Set Accept-Language header for selected locale
    const locale = await getLocale();
    if (locale) {
      config.headers["Accept-Language"] = locale;
    }

    // Add API token from environment
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
    if (apiToken) {
      config.headers["Token"] = apiToken;
    }

    // Add Authorization header if access token exists in cookie
    const accessToken = await getCookie("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Add guest identifier header if exists in cookie
    const guestIdentifier = await getCookie("guest_identifier");
    if (guestIdentifier) {
      config.headers["identifier"] = guestIdentifier;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional, for handling responses globally)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error responses here if needed
    return Promise.reject(error);
  }
);

export default axiosInstance;
