import { getCookie, deleteCookie } from "cookies-next";

/**
 * Get the authentication token from cookies
 * @returns {string | null} The auth token or null if not found
 */
export const getAuthToken = () => {
  return getCookie("access_token")?.toString() || getCookie("auth_token")?.toString() || null;
};

/**
 * Get the user data from cookies
 * @returns {object | null} The user object or null if not found
 */
export const getUserData = () => {
  const userData = getCookie("user_data");
  if (!userData) return null;

  try {
    return JSON.parse(userData.toString());
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Logout user by clearing auth cookies
 */
export const logout = () => {
  deleteCookie("access_token", { path: "/" });
  deleteCookie("auth_token", { path: "/" });
  deleteCookie("user_data", { path: "/" });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }
};

/**
 * Clear guest identifier (used when user logs in)
 */
export const clearGuestIdentifier = () => {
  deleteCookie("guest_identifier", { path: "/" });
};

