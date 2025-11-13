import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image Container */}
      <div className="relative mb-4 aspect-square">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
        {/* Heart Icon */}
        <button className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[22px] font-semibold text-[#3696E7]">
          {product.price.toFixed(2)} ₼
        </span>
        <span className="text-[16px] text-gray-400 line-through">
          {product.oldPrice.toFixed(2)} ₼
        </span>
      </div>

      {/* Title and Code */}
      <h3 className="text-[14px] text-gray-900 mb-0.5 font-medium">
        {product.title}
      </h3>
      <p className="text-[14px] text-gray-900 mb-3">{product.code}</p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#FF6B35] text-[#FF6B35]" />
          ))}
        </div>
        <span className="text-[13px] text-gray-600">
          ({product.reviews} reytinq)
        </span>
      </div>

      <Button
        variant="primary"
        size="default"
        className="w-full text-[14px] font-medium cursor-pointer"
      >
        <ShoppingCart className="w-4 h-4" />
        Səbətə əlavə et
      </Button>
    </div>
  );
}
