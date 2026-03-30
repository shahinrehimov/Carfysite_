import axios from "axios";
import { getCookie } from "cookies-next";
import { getLocale } from "next-intl/server";

const getCookieValue = (name) => {
  return getCookie(name)?.toString();
};

const createAxiosInstance = (serverSide = false) => {
  const api = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_PROTOCOL +
      "://" +
      process.env.NEXT_PUBLIC_API_HOST +
      "/api/site",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Token: process.env.NEXT_PUBLIC_API_TOKEN,
    },
  });

  api.interceptors.request.use(
    async (config) => {
      let currentLang;
      let authToken;

      if (serverSide) {
        try {
          currentLang = await getLocale();
        } catch {
          currentLang = "az";
        }
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          authToken = cookieStore.get("auth_token")?.value;
        } catch {
          authToken = undefined;
        }
      } else {
        currentLang = getCookieValue("NEXT_LOCALE") || "az";
        authToken = getCookieValue("auth_token");
      }

      config.headers["Accept-Language"] = currentLang;

      // Add Authorization header if token exists
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (serverSide) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createAxiosInstance(false);
export const serverApi = createAxiosInstance(true);
