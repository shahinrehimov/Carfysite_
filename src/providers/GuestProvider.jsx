"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { guestService } from "@/lib/guestService";
import { isAuthenticated } from "@/lib/auth";

const GuestContext = createContext({
  guestIdentifier: null,
  isLoading: true,
  initializeGuest: () => {},
});

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}

export function GuestProvider({ children }) {
  const [guestIdentifier, setGuestIdentifier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeGuest = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const authenticated = isAuthenticated();

      // Initialize guest identifier if needed
      const result = await guestService.initializeIfNeeded(authenticated);

      if (result.success && result.identifier) {
        setGuestIdentifier(result.identifier);
      }
    } catch (error) {
      console.error("Error initializing guest identifier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize guest identifier on component mount
    initializeGuest();

    // Listen for auth state changes
    const handleAuthChange = () => {
      const authenticated = isAuthenticated();
      if (authenticated) {
        // Clear guest identifier when user logs in
        guestService.clearIdentifier();
        setGuestIdentifier(null);
      } else {
        // Reinitialize guest identifier when user logs out
        initializeGuest();
      }
    };

    // Listen for storage events (login/logout in other tabs)
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const value = {
    guestIdentifier,
    isLoading,
    initializeGuest,
  };

  return (
    <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
  );
}
