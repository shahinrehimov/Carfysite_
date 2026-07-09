import { setCookie, deleteCookie } from "cookies-next";
import { api } from "@/lib/axios";

const AUTH_COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === "production",
  httpOnly: false,
  sameSite: "lax",
};

/**
 * Persist login session from API response (phone, email, or third-party).
 * Supports both wrapped `{ token, data }` and flat UserResource shapes.
 */
export function saveAuthSession(data) {
  const token = data?.token;
  if (!token) return false;

  const userData =
    data.data ??
    (() => {
      const { token: _token, ...rest } = data;
      return rest;
    })();

  setCookie("access_token", token, AUTH_COOKIE_OPTIONS);
  setCookie("auth_token", token, AUTH_COOKIE_OPTIONS);
  setCookie("user_data", JSON.stringify(userData), AUTH_COOKIE_OPTIONS);
  deleteCookie("guest_identifier");

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }

  return true;
}

async function initiateOAuthLogin(provider) {
  const response = await api.get(`/auth/${provider}`);

  if (response.data?.step === "redirect" && response.data?.url) {
    window.location.href = response.data.url;
    return;
  }

  throw new Error(`Invalid ${provider} login response`);
}

/**
 * Start Apple web redirect flow (GET /auth/apple → redirect to Apple).
 */
export async function initiateAppleLogin() {
  return initiateOAuthLogin("apple");
}

/**
 * Start Google web redirect flow (GET /auth/google → redirect to Google).
 */
export async function initiateGoogleLogin() {
  return initiateOAuthLogin("google");
}

/**
 * Exchange one-time third-party token for a real session token.
 */
export async function loginWithThirdParty(token, provider) {
  const response = await api.post("/login/with-third-party", {
    device_type: "web",
    provider,
    token,
  });

  return response.data;
}
