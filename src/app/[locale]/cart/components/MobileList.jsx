"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import { isSellerClosed } from "@/lib/storeAvailability";
import ClosedStoreItemWarning from "@/components/store/ClosedStoreItemWarning";
import { cn } from "@/lib/utils";

const ProductCard = ({
  product,
  index,
  onIncrement,
  onDecrement,
  onRemove,
  onToggleWishlist,
  isLoading,
  wishlistState,
  isUpdatingWishlist,
  sellerClosed,
}) => {
  const t = useTranslations();
  const quantity = product.basket_quantity || product.quantity || 1;
  const price = product.price_final || product.price || 0;
  const oldPrice = product.price || price;
  const discount =
    product.has_discount && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const itemData = product.product || product;
  const imageUrl =
    product.hover_image ||
    itemData.hover_image ||
    "/images/product-placeholder.png";
  const title = product.title || itemData.title || t("product");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={cn(
        "bg-white rounded-2xl p-4 border",
        sellerClosed ? "border-amber-200 bg-amber-50/60" : "border-gray-100"
      )}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
            <Image src={imageUrl} alt={title} fill className="object-contain" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 leading-tight text-sm line-clamp-2">
              {title}
            </h3>
            {/* Wishlist Heart */}
            <button
              type="button"
              className="flex-shrink-0 ml-2 p-1 disabled:cursor-wait disabled:opacity-60"
              disabled={isUpdatingWishlist}
              onClick={() => {
                const currentState =
                  wishlistState !== undefined
                    ? wishlistState
                    : product.in_wishlist;
                onToggleWishlist(product.uuid, currentState);
              }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  wishlistState !== undefined
                    ? wishlistState
                      ? "text-[#3696E7] fill-[#3696E7]"
                      : "text-gray-400 hover:text-[#3696E7]"
                    : product.in_wishlist
                      ? "text-[#3696E7] fill-[#3696E7]"
                      : "text-gray-400 hover:text-[#3696E7]"
                }`}
              />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-gray-900 text-base">
              {formatPrice(price)} ₼
            </span>
            {product.has_discount && oldPrice > price && (
              <>
                <span className="text-gray-400 line-through text-xs">
                  {formatPrice(oldPrice)} ₼
                </span>
                <span className="text-red-500 font-medium text-xs">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <ClosedStoreItemWarning seller={product.seller} t={t} />

          {/* Quantity Controls and Remove Button */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <button
                onClick={() => onDecrement(product.uuid)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={isLoading || quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium border-x border-gray-300 py-1">
                {quantity}
              </span>
              <button
                onClick={() => onIncrement(product.uuid)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(product.uuid)}
              className="flex items-center justify-center w-10 h-8 bg-gray-100 hover:bg-red-50 rounded-lg transition-colors group disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MobileList() {
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

  const handleRemove = async (productUuid) => {
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

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {cartItems.map((item, index) => (
          <ProductCard
            key={item.id}
            product={item}
            index={index}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onToggleWishlist={toggleWishlist}
            isLoading={isLoading}
            wishlistState={wishlistStates[item.uuid]}
            isUpdatingWishlist={Boolean(updatingWishlistIds[item.uuid])}
            sellerClosed={isSellerClosed(item.seller)}
          />
        ))}
      </AnimatePresence>

      {cartItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("cart-empty")}</p>
        </div>
      )}
    </div>
  );
}
