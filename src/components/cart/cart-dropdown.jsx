"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectBasketData,
  selectTotalItems,
  setBasketData,
} from "@/store/cart";
import { basketService } from "@/lib/basketService";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function CartDropdown() {
  const cartItems = useSelector(selectCartItems);
  const basketData = useSelector(selectBasketData);
  const cartCount = useSelector(selectTotalItems);
  const dispatch = useDispatch();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Load basket data on component mount
  useEffect(() => {
    const loadBasket = async () => {
      try {
        const data = await basketService.load();
        dispatch(setBasketData(data));
      } catch (error) {
        console.error("Failed to load basket:", error);
      }
    };

    loadBasket();
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleRemoveFromCart = async (uuid) => {
    try {
      await basketService.remove(uuid);
      const data = await basketService.load();
      dispatch(setBasketData(data));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleIncrement = async (uuid) => {
    try {
      await basketService.increment(uuid);
      const data = await basketService.load();
      dispatch(setBasketData(data));
    } catch (error) {
      console.error("Error incrementing cart item:", error);
    }
  };

  const handleDecrement = async (uuid) => {
    try {
      await basketService.decrement(uuid);
      const data = await basketService.load();
      dispatch(setBasketData(data));
    } catch (error) {
      console.error("Error decrementing cart item:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[#1A1A1A] relative hover:text-[#00569C] transition-colors"
      >
        <div className="relative">
          <Image
            src="/icons/cart.svg"
            alt="cart"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-sm">{t("cart")}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 rounded-2xl shadow-xl border border-gray-200 w-[400px] max-h-[600px] flex flex-col z-50 bg-white"
          >
            {cartItems.length === 0 ? (
              <div className="p-8 text-center">
                <Image
                  src="/icons/cart.svg"
                  alt="Empty cart"
                  width={60}
                  height={60}
                  className="mx-auto mb-4 opacity-30"
                />
                <p className="text-gray-500 text-sm">{t("cart-empty")}</p>
              </div>
            ) : (
              <>
                <div className="overflow-y-auto max-h-[400px] p-4 bg-white/50 backdrop-blur-sm rounded-2xl">
                  <div className="space-y-3">
                    {cartItems.filter(Boolean).map((item) => {
                      const itemData = item.product || item;
                      const imageUrl =
                        item.hover_image ||
                        itemData.hover_image ||
                        "/images/product-placeholder.png";
                      const title = item.title || itemData.title || t("product");
                      const quantity =
                        item.basket_quantity || item.quantity || 1;
                      const price = item.price_final || item.price || 0;

                      return (
                        <div
                          key={item.id}
                          className="rounded-xl p-3 flex  gap-3"
                        >
                          <div className="w-[66px] h-[66px] rounded-lg bg-white  flex items-center justify-center shrink-0 overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={title}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-normal text-[#1A1A1A] mb-1 line-clamp-2">
                              {title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.oem_code}
                            </p>
                          </div>

                          <div className="flex flex-col items-end justify-between h-full gap-2">
                            <p className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap">
                              {formatPrice(price * quantity)} ₼
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDecrement(item.uuid)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#3696E7] hover:text-[#3696E7] transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item.uuid)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#3696E7] hover:text-[#3696E7] transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRemoveFromCart(item.uuid)}
                                className="cursor-pointer"
                              >
                                <Image
                                  src="/icons/delete.svg"
                                  alt="delete"
                                  width={20}
                                  height={20}
                                  className="w-5 h-5"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-4 bg-[#eeeeee] rounded-b-2xl">
                  <div className="flex items-center justify-between mb-4 gap-4">
                    <span className="text-base text-gray-600 whitespace-nowrap">
                      {t("total-amount")}
                    </span>
                    <div className="border-b border-gray-900  w-full border-dashed pt-3"></div>
                    <span className="text-xl font-semibold text-[#1A1A1A] whitespace-nowrap">
                      {formatPrice(basketData.total_price_final_in_basket || 0)}{" "}
                      ₼
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="default"
                      className="w-full border-2 rounded-full border-[#00569C] text-[#00569C]"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/cart">{t("go-to-cart")}</Link>
                    </Button>
                    <Button
                      asChild
                      variant="primary"
                      size="default"
                      className="w-full font-[16px] font-regular"
                      onClick={() => setIsOpen(false)}
                      aria-label={t("complete-order")}
                    >
                      <Link
                        href="/checkout"
                        className="text-white text-[16px] text-regular"
                      >
                        {t("complete-order")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
