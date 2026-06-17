import axios from "axios";
import { getCookie, setCookie, removeCookie } from "./utils";
import { getLocale } from "./locale";
import { promptEmailVerification } from "@/lib/emailVerificationBridge";

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

    const accessToken = await getCookie("access_token");
    const guestIdentifier = await getCookie("guest_identifier");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      delete config.headers["identifier"];
    } else if (guestIdentifier) {
      config.headers["identifier"] = guestIdentifier;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handles global email-verification and guest-identifier retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    const status = response?.status;
    const data = response?.data;

    // ── 1. Email not verified ────────────────────────────────────────────────
    if (
      status === 403 &&
      data?.step === "otp_email" &&
      !config?._skipEmailVerification &&
      !config?._retried
    ) {
      const verified = await promptEmailVerification();
      if (verified) {
        config._retried = true;
        return axiosInstance(config);
      }
    }

    // ── 2. Guest identifier expired / not found ──────────────────────────────
    if (
      status === 403 &&
      (data?.message === "User or Guest not found!" || data?.message === "Invalid guest identifier!") &&
      !config?._guestRetried
    ) {
      try {
        removeCookie("guest_identifier");

        // Use raw fetch to bypass this interceptor and avoid infinite loops
        const apiBase =
          process.env.NEXT_PUBLIC_API_PROTOCOL +
          "://" +
          process.env.NEXT_PUBLIC_API_HOST +
          "/api/site";

        const res = await fetch(`${apiBase}/guests/generate-identifier`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Token: process.env.NEXT_PUBLIC_API_TOKEN || "",
          },
          body: JSON.stringify({ device_type: "web" }),
        });

        if (res.ok) {
          const resData = await res.json();
          setCookie("guest_identifier", resData.identifier, {
            maxAge: 365 * 24 * 60 * 60,
            httpOnly: false,
            sameSite: "lax",
          });
          config._guestRetried = true;
          return axiosInstance(config);
        }
      } catch {
        // Regeneration failed — fall through and reject with original error
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
