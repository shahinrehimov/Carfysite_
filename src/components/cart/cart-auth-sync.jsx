"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBasketData, clearCart } from "@/store/cart";
import { basketService } from "@/lib/basketService";
import { isAuthenticated } from "@/lib/auth";

export default function CartAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const reloadBasket = async () => {
      try {
        const data = await basketService.load();
        dispatch(setBasketData(data));
      } catch {
        if (!isAuthenticated()) {
          dispatch(clearCart());
        }
      }
    };

    const handleAuthChange = () => {
      if (!isAuthenticated()) {
        dispatch(clearCart());
        return;
      }
      reloadBasket();
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("guestReady", reloadBasket);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("guestReady", reloadBasket);
    };
  }, [dispatch]);

  return null;
}
