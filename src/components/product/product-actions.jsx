"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { basketService } from "@/lib/basketService";
import { wishlistService } from "@/lib/wishlistService";
import { setBasketData, setLoading, setError } from "@/store/cart";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";
import FitmentSelectionModal from "@/components/product/fitment-selection-modal";

export default function ProductActions({ data }) {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(data?.in_wishlist || false);
  const [inBasket, setInBasket] = useState(data?.in_basket || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [fitmentOpen, setFitmentOpen] = useState(false);
  const needsFitment = Boolean(data?.requires_fitment_selection);

  useEffect(() => {
    setIsFavorite(data?.in_wishlist || false);
    setInBasket(data?.in_basket || false);
  }, [data?.uuid, data?.in_wishlist, data?.in_basket]);

  const handleWishlistToggle = async () => {
    if (!data?.uuid) {
      console.error("Product UUID is required for wishlist operations");
      return;
    }

    try {
      if (isFavorite) {
        await wishlistService.remove(data.uuid);
        setIsFavorite(false);
        toast({
          title: t("success"),
          description: t("wishlist_product_removed"),
          variant: "info",
        });
      } else {
        await wishlistService.add(data.uuid);
        setIsFavorite(true);
        toast({
          title: t("success"),
          description: t("wishlist_product_added"),
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error?.response?.data?.message || t("wishlist_update_failed"),
        variant: "error",
      });
    }
  };

  const handleAddToCart = async () => {
    if (isAddingToCart || !data?.uuid || (!needsFitment && inBasket)) {
      return;
    }

    if (needsFitment) {
      setFitmentOpen(true);
      return;
    }

    setIsAddingToCart(true);

    try {
      dispatch(setLoading(true));
      await basketService.add(data.uuid, 1);
      const basketData = await basketService.load();
      dispatch(setBasketData(basketData));

      setInBasket(true);

      toast({
        title: t("success"),
        description: t("product-added-to-cart"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error?.response?.data?.message || t("failed-to-add-to-cart"),
        variant: "error",
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  const canAct = Boolean(data?.uuid);

  return (
    <div className="space-y-4 mt-4">
      <button
        type="button"
        onClick={handleWishlistToggle}
        disabled={!canAct}
        className={cn(
          "flex items-center gap-2 text-[#00569C] hover:text-[#00569C] transition-colors",
          canAct ? "cursor-pointer" : "cursor-not-allowed opacity-50"
        )}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? "fill-[#00569C]" : ""}`} />
        <span className="text-sm">{t("add_to_favorites")}</span>
      </button>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart || (!needsFitment && inBasket) || !canAct}
          className={cn(
            "flex-1 group bg-white hover:bg-[#00569C] hover:text-white text-[#00569C] border border-[#00569C] font-semibold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2",
            isAddingToCart || (!needsFitment && inBasket) || !canAct
              ? "opacity-70 cursor-not-allowed hover:bg-white hover:text-[#00569C]"
              : "cursor-pointer"
          )}
        >
          <Image
            src="/icons/cart-primary.svg"
            alt="Cart"
            width={24}
            height={24}
            className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
          />
          <span>
            {isAddingToCart
              ? t("adding")
              : !needsFitment && inBasket
                ? t("in_cart")
                : t("add_to_cart")}
          </span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="bg-white cursor-pointer group hover:bg-[#00569C] border border-[#00569C] w-14 h-14 rounded-full transition-colors flex items-center justify-center"
        >
          <Image
            src="/icons/share.svg"
            alt="Share"
            width={24}
            height={24}
            className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
          />
        </button>
      </div>
      <FitmentSelectionModal
        open={fitmentOpen}
        onOpenChange={setFitmentOpen}
        productUuid={data?.uuid}
        options={data?.fitment_selection_options}
        pending={isAddingToCart}
        onConfirm={async (selection) => {
          setIsAddingToCart(true);
          try {
            dispatch(setLoading(true));
            await basketService.add(data.uuid, 1, selection);
            const basketData = await basketService.load();
            dispatch(setBasketData(basketData));
            setFitmentOpen(false);
            toast({
              title: t("success"),
              description: t("product-added-to-cart"),
              variant: "success",
            });
          } catch (error) {
            toast({
              title: t("error"),
              description:
                error?.response?.data?.message || t("failed-to-add-to-cart"),
              variant: "error",
            });
            dispatch(setError(error.message));
          } finally {
            dispatch(setLoading(false));
            setIsAddingToCart(false);
          }
        }}
      />
    </div>
  );
}
