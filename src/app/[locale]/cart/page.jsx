"use client";

import React from "react";
import { useCart } from "@/contexts/cart-context";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const t = useTranslations();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-20">
          <Image
            src="/icons/cart.svg"
            alt="Empty cart"
            width={80}
            height={80}
            className="mx-auto mb-6 opacity-30"
          />
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4">
            {t("cart-empty")}
          </h2>
          <p className="text-gray-500 mb-8">{t("cart-empty-description")}</p>
          <Button asChild variant="primary" size="lg">
            <Link href="/">{t("continue-shopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 lg:pb-8">
      <div className="container py-4 lg:py-8">
        <h1 className="text-xl lg:text-3xl font-semibold text-[#1A1A1A] mb-4 lg:mb-6">
          {t("cart")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 lg:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white lg:bg-[#F5F5F5] rounded-2xl p-4 lg:p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 lg:w-12 lg:h-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-base font-normal text-[#1A1A1A] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-500 mb-2">
                      {item.code || item.id}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Price and Delete */}
                  <div className="flex flex-col items-end gap-2 lg:gap-3">
                    <p className="text-base lg:text-xl font-semibold text-[#1A1A1A] whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)} ₼
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label={t("remove-from-cart")}
                    >
                      <Trash2 size={18} className="lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">
                {t("order-summary")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>{t("subtotal")}</span>
                  <span className="font-medium">
                    {formatPrice(getCartTotal())} ₼
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold text-[#1A1A1A]">
                    <span>{t("total-amount")}</span>
                    <span>{formatPrice(getCartTotal())} ₼</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild variant="primary" size="lg" className="w-full">
                  <Link href="/checkout">{t("complete-order")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/">{t("continue-shopping")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base text-gray-600">{t("total-amount")}</span>
            <span className="text-xl font-semibold text-[#1A1A1A]">
              {formatPrice(getCartTotal())} ₼
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">{t("continue-shopping")}</Link>
            </Button>
            <Button asChild variant="primary" size="lg" className="w-full">
              <Link href="/checkout">{t("complete-order")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
