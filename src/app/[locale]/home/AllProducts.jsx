"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/product-card";

// Generate 50 mock products
const products = Array.from({ length: 50 }, (_, index) => {
  const imageNumber = (index % 4) + 1; // Rotate through 4 images
  const priceVariation = Math.floor(Math.random() * 500) + 100; // Random price between 100-600
  const discountPercent = Math.random() > 0.5 ? 1.2 : 1.1; // 10% or 20% discount
  const oldPrice = priceVariation * discountPercent;
  const reviews = Math.floor(Math.random() * 100) + 20; // Random reviews 20-120

  return {
    id: index + 1,
    image: `/images/product-${imageNumber}.png`,
    title: "Automobile spare part",
    code: `36242${8345 + index}`,
    price: priceVariation,
    oldPrice: parseFloat(oldPrice.toFixed(2)),
    rating: 5,
    reviews: reviews,
  };
});

function AllProducts() {
  return (
    <div className="pt-12 pb-30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-semibold text-gray-900">
          Bütün Məhsullar
        </h2>
        <button className="flex items-center gap-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors">
          <span>Filter</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16667 5.83333H15.8333M6.66667 10H13.3333M8.33333 14.1667H11.6667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
