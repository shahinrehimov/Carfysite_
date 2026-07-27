"use client";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { basketService } from "@/lib/basketService";
import { wishlistService } from "@/lib/wishlistService";
import { setBasketData, setLoading, setError } from "@/store/cart";
import { useToast } from "@/providers/ToastProvider";
import { useTranslations } from "next-intl";
import { getProductUrl } from "@/lib/getProductUrl";

export default function ProductCard({ product }) {
  const t = useTranslations();
  const [isLiked, setIsLiked] = useState(product.in_wishlist || false);
  const [inBasket, setInBasket] = useState(product.in_basket || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  useEffect(() => {
    setIsLiked(product.in_wishlist || false);
    setInBasket(product.in_basket || false);
  }, [product?.uuid, product.in_wishlist, product.in_basket]);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  // Extract data from API structure
  const productData = product.product || product;
  const imageUrl = productData.hover_image || "/images/product-placeholder.png";
  const title = product.title || productData.title || t("product");
  const price = product.price_final || product.price || 0;
  const oldPrice = product.has_discount ? product.price : price;
  const hasDiscount = product.has_discount && oldPrice > price;

  // Handle wishlist toggle (optimistic UI)
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    if (!product?.uuid) {
      console.error("Product UUID is required for wishlist operations");
      return;
    }

    if (isUpdatingWishlist) {
      return;
    }

    const previousState = isLiked;
    const nextState = !previousState;

    setIsLiked(nextState);
    setIsUpdatingWishlist(true);

    try {
      if (previousState) {
        await wishlistService.remove(product.uuid);
        toast({
          title: t("wishlist_product_removed"),
          description: t("wishlist_product_removed_description"),
          variant: "info",
        });
      } else {
        await wishlistService.add(product.uuid);
        toast({
          title: t("wishlist_product_added"),
          description: t("wishlist_product_added_description"),
          variant: "success",
        });
      }
    } catch (error) {
      setIsLiked(previousState);
      toast({
        title: t("error"),
        description:
          error?.response?.data?.message || t("wishlist_update_failed"),
        variant: "error",
      });
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (isAddingToCart || !product?.uuid || inBasket) {
      return;
    }

    setIsAddingToCart(true);

    try {
      dispatch(setLoading(true));
      await basketService.add(product.uuid, 1);
      const basketData = await basketService.load();
      dispatch(setBasketData(basketData));

      // Update local state
      setInBasket(true);

      toast({
        title: t("product_added_to_cart"),
        description: t("product_added_to_cart_description"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("failed_to_add_to_cart"),
        description:
          error?.response?.data?.message ||
          t("failed_to_add_to_cart_description"),
        variant: "error",
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      setIsAddingToCart(false);
    }
  };

  return (
    <div
      className=" cursor-pointer bg-white rounded-[20px] p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
      onClick={() => {
        const url = getProductUrl(product);
        if (url) router.push(url);
      }}
    >
      {/* Image Container */}
      <div className="relative mb-3 lg:mb-4 aspect-square">
        <Image src={imageUrl} alt={title} fill className="object-contain" />
        {/* Heart Icon */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isUpdatingWishlist}
          aria-pressed={isLiked}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-colors",

            isLiked
              ? "bg-[#3696E7] hover:bg-[#2a7bc9]"
              : "bg-white hover:bg-gray-50 border border-gray-100"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isLiked ? "text-white fill-white" : "text-gray-400"
            )}
          />
        </button>

        {/* Discount Badge */}
        {hasDiscount && product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-1 lg:mb-2">
        <span className="text-lg lg:text-[22px] font-semibold text-[#3696E7]">
          {price.toFixed(2)} ₼
        </span>
        {hasDiscount && (
          <span className="text-sm lg:text-[16px] text-gray-400 line-through">
            {oldPrice.toFixed(2)} ₼
          </span>
        )}
      </div>

      {/* Title and Brand */}
      <h3 className="text-[13px] lg:text-[14px] text-gray-900 mb-0.5 font-medium line-clamp-2">
        {title}
      </h3>
      {productData.brand && (
        <p className="text-[13px] lg:text-[14px] text-gray-600 mb-2 lg:mb-3">
          {productData.brand.title}
        </p>
      )}

      {/* Rating */}
      <div className="flex items-center gap-1 lg:gap-2 mb-3 lg:mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5 lg:w-4 lg:h-4",
                i < Math.round(product.ratings?.average || 0)
                  ? "fill-[#FF6B35] text-[#FF6B35]"
                  : "fill-gray-200 text-gray-200"
              )}
            />
          ))}
        </div>
        <span className="text-[8px] lg:text-[12px] text-gray-600">
          {product.ratings?.count || 0} {t("ratings")}
        </span>
      </div>

      {/* Add to Cart Button - pushes to bottom */}
      <div className="mt-auto">
        <Button
          variant="primary"
          size="default"
          className={cn(
            "w-full text-[12px] lg:text-[14px] font-medium h-10 lg:h-11",
            inBasket
              ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed opacity-70"
              : "cursor-pointer"
          )}
          onClick={handleAddToCart}
          disabled={isAddingToCart || inBasket}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddingToCart
            ? t("adding")
            : inBasket
              ? t("in_cart")
              : t("add_to_cart")}
        </Button>
      </div>
    </div>
  );
}
