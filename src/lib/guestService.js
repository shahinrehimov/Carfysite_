import { api } from "./axios/api";
import { setCookie, getCookie } from "./axios/utils";

/**
 * Guest identifier service for managing anonymous user sessions
 */
export const guestService = {
  /**
   * Generate a new guest identifier
   * @returns {Promise<Object>} Response with identifier and message
   */
  async generateIdentifier() {
    try {
      const response = await api.post("/guests/generate-identifier", {
        device_type: "web",
      });

      const { identifier, message } = response.data;

      // Set identifier in both client and server cookies
      setCookie("guest_identifier", identifier, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        secure: process.env.NODE_ENV === "production",
        httpOnly: false, // Allow client-side access for axios interceptor
        sameSite: "lax",
      });

      return { success: true, identifier, message };
    } catch (error) {
      console.error("Error generating guest identifier:", error);
      return {
        success: false,
        error: error.message || "Failed to generate guest identifier",
      };
    }
  },

  /**
   * Get existing guest identifier from cookie
   * @returns {string|null} Guest identifier or null if not found
   */
  getIdentifier() {
    return getCookie("guest_identifier");
  },

  /**
   * Check if user has a guest identifier
   * @returns {boolean} True if guest identifier exists
   */
  hasIdentifier() {
    return !!this.getIdentifier();
  },

  /**
   * Initialize guest identifier if needed
   * Checks for user authentication and existing identifier
   * @param {boolean} isAuthenticated - Whether user is logged in
   * @returns {Promise<Object>} Result of initialization
   */
  async initializeIfNeeded(isAuthenticated = false) {
    // If user is authenticated, don't need guest identifier
    if (isAuthenticated) {
      return {
        success: true,
        message: "User is authenticated, no guest identifier needed",
      };
    }

    // If guest identifier already exists, no need to generate new one
    if (this.hasIdentifier()) {
      return {
        success: true,
        message: "Guest identifier already exists",
        identifier: this.getIdentifier(),
      };
    }

    // Generate new guest identifier
    return await this.generateIdentifier();
  },

  /**
   * Clear guest identifier (used when user logs in)
   */
  clearIdentifier() {
    if (typeof document !== "undefined") {
      document.cookie =
        "guest_identifier=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },
};

export default guestService;
