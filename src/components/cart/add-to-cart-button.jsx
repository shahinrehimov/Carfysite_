"use client";

import React from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({
  product,
  variant = "primary",
  size = "default",
  className = "",
}) {
  const { addToCart } = useCart();
  const t = useTranslations();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      code: product.code,
    });

    // Optional: Show toast notification
    // You can add a toast library like react-hot-toast or sonner
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
    >
      <ShoppingCart size={18} />
      <span>{t("add-to-cart")}</span>
    </Button>
  );
}
