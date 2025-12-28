"use client";

import { useSelector } from "react-redux";
import { selectCartItems } from "@/store/cart";
import CartTotals from "./CartTotals";

export default function CartTotalsWrapper() {
  const cartItems = useSelector(selectCartItems);

  // Only show totals if there are items in the cart
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="col-span-3 hidden lg:block"></div>
      <CartTotals />
    </div>
  );
}

