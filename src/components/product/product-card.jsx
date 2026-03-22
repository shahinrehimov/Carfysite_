"use client";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { basketService } from "@/lib/basketService";
import { wishlistService } from "@/lib/wishlistService";
import { addItem, setLoading, setError } from "@/store/cart";
import { useToast } from "@/providers/ToastProvider";

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(product.in_wishlist || false);
  const [inBasket, setInBasket] = useState(product.in_basket || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Extract data from API structure
  const productData = product.product || product;
  const imageUrl =
    product.hover_image ||
    productData.hover_image ||
    "/images/product-placeholder.png";
  const title = product.title || productData.title || "Product";
  const slug = product.slug || productData.slug;
  const price = product.price_final || product.price || 0;
  const oldPrice = product.has_discount ? product.price : price;
  const hasDiscount = product.has_discount && oldPrice > price;

  // Handle wishlist toggle
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    if (!product?.id) {
      console.error("Product ID is required for wishlist operations");
      return;
    }

    try {
      if (isLiked) {
        const result = await wishlistService.remove(product.id);
        if (result.success) {
          setIsLiked(false);
          toast({
            title: "Removed from wishlist",
            description: "Product removed from your wishlist",
            variant: "info",
          });
        }
      } else {
        const result = await wishlistService.add(product.id);
        if (result.success) {
          setIsLiked(true);
          toast({
            title: "Added to wishlist",
            description: "Product added to your wishlist",
            variant: "success",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update wishlist",
        variant: "error",
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (isAddingToCart || !product?.id || inBasket) {
      return;
    }

    setIsAddingToCart(true);

    try {
      dispatch(setLoading(true));
      const response = await basketService.add(product.id, 1);
      dispatch(addItem(response));

      // Update local state
      setInBasket(true);

      toast({
        title: "Added to cart",
        description: "Product successfully added to your cart",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Cannot add to cart",
        description:
          error?.response?.data?.message || "Failed to add product to cart",
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
      onClick={() =>
        router.push(
          productData.category_slugs.parent_category_slug
            ? `/${productData.category_slugs.parent_category_slug}/${productData.category_slugs.sub_category_slug}/${slug}`
            : `/${productData.category_slugs.sub_category_slug}/${slug}}`
        )
      }
    >
      {/* Image Container */}
      <div className="relative mb-3 lg:mb-4 aspect-square">
        <Image src={imageUrl} alt={title} fill className="object-contain" />
        {/* Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer",
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

      {/* Rating - Placeholder for now */}
      <div className="flex items-center gap-1 lg:gap-2 mb-3 lg:mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 lg:w-5 lg:h-5 fill-[#FF6B35] text-[#FF6B35]"
            />
          ))}
        </div>
        <span className="text-[11px] lg:text-[13px] text-gray-600">
          (0 reytinq)
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
            ? "Əlavə olunur..."
            : inBasket
              ? "Səbətdə"
              : "Səbətə əlavə et"}
        </Button>
      </div>
    </div>
  );
}
