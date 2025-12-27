import {
  getCookie as getCookieNext,
  setCookie as setCookieNext,
  deleteCookie,
} from "cookies-next";

/**
 * Get cookie value by name
 * Works both on server-side and client-side using cookies-next
 * @param {string} name - Cookie name
 * @param {Object} options - Optional request/response context for server-side
 * @returns {string|undefined} Cookie value or undefined if not found
 */
export function getCookie(name, options = {}) {
  return getCookieNext(name, options);
}

/**
 * Set cookie
 * Works both on server-side and client-side using cookies-next
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 */
export function setCookie(name, value, options = {}) {
  return setCookieNext(name, value, {
    path: "/",
    sameSite: "lax",
    ...options,
  });
}

/**
 * Remove cookie
 * Works both on server-side and client-side using cookies-next
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options
 */
export function removeCookie(name, options = {}) {
  return deleteCookie(name, {
    path: "/",
    ...options,
  });
}

