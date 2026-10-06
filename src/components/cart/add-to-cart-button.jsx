"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { basketService } from "@/lib/basketService";
import { setBasketData, setLoading, setError } from "@/store/cart";
import { useToast } from "@/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import FitmentSelectionModal from "@/components/product/fitment-selection-modal";

export default function AddToCartButton({
  product,
  variant = "primary",
  size = "default",
  className = "",
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const t = useTranslations();
  const [isAdding, setIsAdding] = useState(false);
  const [fitmentOpen, setFitmentOpen] = useState(false);
  const productId = product?.uuid || product?.id;
  const needsFitment = Boolean(product?.requires_fitment_selection);

  const handleAddToCart = async () => {
    if (isAdding || !productId) {
      return;
    }

    if (needsFitment) {
      setFitmentOpen(true);
      return;
    }

    setIsAdding(true);

    try {
      dispatch(setLoading(true));
      await basketService.add(productId, 1);
      const basketData = await basketService.load();
      dispatch(setBasketData(basketData));

      toast({
        title: t("success"),
        description: t("product-added-to-cart"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: error?.response?.data?.message || t("failed-to-add-to-cart"),
        variant: "error",
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      setIsAdding(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleAddToCart}
        variant={variant}
        size={size}
        className={className}
        disabled={isAdding}
      >
        <ShoppingCart size={18} />
        <span>{isAdding ? t("adding") : t("add-to-cart")}</span>
      </Button>
      <FitmentSelectionModal
        open={fitmentOpen}
        onOpenChange={setFitmentOpen}
        productUuid={productId}
        options={product?.fitment_selection_options}
        pending={isAdding}
        onConfirm={async (selection) => {
          setIsAdding(true);
          try {
            dispatch(setLoading(true));
            await basketService.add(productId, 1, selection);
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
            setIsAdding(false);
          }
        }}
      />
    </>
  );
}
