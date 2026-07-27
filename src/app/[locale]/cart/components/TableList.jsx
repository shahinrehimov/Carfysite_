"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Minus, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { basketService } from "@/lib/basketService";
import { wishlistService } from "@/lib/wishlistService";
import {
  selectCartItems,
  selectCartLoading,
  setLoading,
  setError,
  updateItemQuantity,
  setBasketData,
} from "@/store/cart";
import { useToast } from "@/providers/ToastProvider";
import { useTranslations } from "next-intl";

export default function TableList() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isLoading = useSelector(selectCartLoading);
  const { toast } = useToast();
  const [wishlistStates, setWishlistStates] = useState({});
  const [updatingWishlistIds, setUpdatingWishlistIds] = useState({});

  const handleIncrement = async (productId) => {
    try {
      dispatch(setLoading(true));
      const response = await basketService.increment(productId);
      dispatch(
        updateItemQuantity({
          productId,
          quantity: response.quantity,
          basket_data: response.basket_data,
        })
      );
    } catch (error) {
      toast({
        title: t("error"),
        description: error?.response?.data?.message || t("failed-to-update"),
        variant: "error",
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDecrement = async (productId) => {
    try {
      dispatch(setLoading(true));
      const response = await basketService.decrement(productId);
      dispatch(
        updateItemQuantity({
          productId,
          quantity: response.quantity,
          basket_data: response.basket_data,
        })
      );
    } catch (error) {
      toast({
        title: t("error"),
        description: error?.response?.data?.message || t("failed-to-update"),
        variant: "error",
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeItem = async (productUuid) => {
    if (!productUuid || isLoading) {
      return;
    }

    try {
      dispatch(setLoading(true));
      await basketService.remove(productUuid);
      const basketData = await basketService.load();
      dispatch(setBasketData(basketData));
      toast({
        title: t("success"),
        description: t("item-removed"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: error?.response?.data?.message || t("failed-to-remove"),
        variant: "error",
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const toggleWishlist = async (productId, currentWishlistState) => {
    if (!productId || updatingWishlistIds[productId]) {
      return;
    }

    setUpdatingWishlistIds((prev) => ({ ...prev, [productId]: true }));
    setWishlistStates((prev) => ({
      ...prev,
      [productId]: !currentWishlistState,
    }));

    try {
      if (currentWishlistState) {
        await wishlistService.remove(productId);
      } else {
        await wishlistService.add(productId);
      }

      toast({
        title: t("success"),
        description: currentWishlistState
          ? t("removed-from-wishlist")
          : t("added-to-wishlist"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setWishlistStates((prev) => ({
        ...prev,
        [productId]: currentWishlistState,
      }));
      toast({
        title: t("error"),
        description:
          error?.response?.data?.message || t("failed-to-update-wishlist"),
        variant: "error",
      });
    } finally {
      setUpdatingWishlistIds((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-2 font-medium text-gray-600">
              {t("items")}
            </th>
            <th className="text-center py-4 px-2 font-medium text-gray-600">
              {t("quantity")}
            </th>
            <th className="text-center py-4 px-2 font-medium text-gray-600">
              {t("price")}
            </th>
            <th className="text-center py-4 px-2 font-medium text-gray-600">
              {t("total")}
            </th>
            <th className="py-4 px-2"></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {cartItems.map((item, index) => {
              const itemData = item.product || item;
              const imageUrl =
                item.hover_image ||
                itemData.hover_image ||
                "/images/product-placeholder.png";
              const title = item.title || itemData.title || t("product");
              const quantity = item.basket_quantity || item.quantity || 1;
              const price = item.price_final || item.price || 0;
              const oldPrice = item.price || price;
              const discount =
                item.has_discount && oldPrice > price
                  ? Math.round(((oldPrice - price) / oldPrice) * 100)
                  : 0;

              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 1, height: "auto" }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Item Column */}
                  <td className="py-6 px-2">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 font-medium w-6">
                        {index + 1}
                      </span>
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                      <span className="font-medium text-gray-900">{title}</span>
                    </div>
                  </td>

                  {/* Quantity Column */}
                  <td className="py-6 px-2">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-12 w-12 rounded-none hover:bg-gray-100 border-0"
                          onClick={() => handleDecrement(item.uuid)}
                          disabled={isLoading || quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="px-4 py-3 min-w-[3rem] text-center font-medium border-l border-r border-gray-300">
                          {quantity}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-12 w-12 rounded-none hover:bg-gray-100 border-0"
                          onClick={() => handleIncrement(item.uuid)}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </td>

                  {/* Price Column */}
                  <td className="py-6 px-2 text-center">
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(price)} ₼
                      </span>
                      {item.has_discount && oldPrice > price && (
                        <>
                          <span className="text-gray-400 line-through text-sm">
                            {formatPrice(oldPrice)} ₼
                          </span>
                          <span className="text-red-500 font-medium text-sm">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Total Column */}
                  <td className="py-6 px-2 text-center">
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <span className="font-bold text-lg text-gray-900">
                        {formatPrice(price * quantity)} ₼
                      </span>
                      {item.has_discount && discount > 0 && (
                        <span className="text-red-500 text-sm font-medium">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-6 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="bg-none border-none cursor-pointer text-gray-400 hover:text-[#3696E7] transition-colors disabled:cursor-wait disabled:opacity-60"
                        disabled={updatingWishlistIds[item.uuid]}
                        onClick={() => {
                          const currentState =
                            wishlistStates[item.uuid] !== undefined
                              ? wishlistStates[item.uuid]
                              : item.in_wishlist;
                          toggleWishlist(item.uuid, currentState);
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            wishlistStates[item.uuid] !== undefined
                              ? wishlistStates[item.uuid]
                                ? "fill-[#3696E7] text-[#3696E7]"
                                : "text-gray-400"
                              : item.in_wishlist
                                ? "fill-[#3696E7] text-[#3696E7]"
                                : "text-gray-400"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        className="bg-none border-none cursor-pointer text-gray-400 hover:text-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => removeItem(item.uuid)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>

      {cartItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("cart-empty")}</p>
        </div>
      )}
    </div>
  );
}
