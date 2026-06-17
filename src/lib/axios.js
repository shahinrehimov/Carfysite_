import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { getLocale } from "next-intl/server";
import { promptEmailVerification } from "@/lib/emailVerificationBridge";

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
          const guestIdentifier = cookieStore.get("guest_identifier")?.value;

          if (authToken) {
            config.headers["Authorization"] = `Bearer ${authToken}`;
            delete config.headers["identifier"];
          } else if (guestIdentifier) {
            config.headers["identifier"] = guestIdentifier;
          }
        } catch {
          authToken = undefined;
        }
      } else {
        currentLang = getCookieValue("NEXT_LOCALE") || "az";
        authToken = getCookieValue("auth_token");
        const guestIdentifier = getCookieValue("guest_identifier");

        if (authToken) {
          config.headers["Authorization"] = `Bearer ${authToken}`;
          delete config.headers["identifier"];
        } else if (guestIdentifier) {
          config.headers["identifier"] = guestIdentifier;
        }
      }

      config.headers["Accept-Language"] = currentLang;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (serverSide) {
        return Promise.reject(error);
      }

      const { response, config } = error;
      const status = response?.status;
      const data = response?.data;

      // ── 1. Email not verified ──────────────────────────────────────────────
      if (
        status === 403 &&
        data?.step === "otp_email" &&
        !config?._skipEmailVerification &&
        !config?._retried
      ) {
        const verified = await promptEmailVerification();
        if (verified) {
          config._retried = true;
          return api(config);
        }
      }

      // ── 2. Guest identifier expired / not found ────────────────────────────
      if (
        status === 403 &&
        (data?.message === "User or Guest not found!" || data?.message === "Invalid guest identifier!") &&
        !config?._guestRetried
      ) {
        try {
          deleteCookie("guest_identifier", { path: "/" });

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
              path: "/",
            });
            config._guestRetried = true;
            return api(config);
          }
        } catch {
          // Regeneration failed — fall through and reject with original error
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createAxiosInstance(false);
export const serverApi = createAxiosInstance(true);
