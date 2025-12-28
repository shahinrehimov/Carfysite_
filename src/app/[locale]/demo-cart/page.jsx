"use client";

import React from "react";
import { useTranslations } from "next-intl";
import AddToCartButton from "@/components/cart/add-to-cart-button";
import Image from "next/image";

export default function DemoCartPage() {
  const t = useTranslations();

  // Sample products for demo
  const sampleProducts = [
    {
      id: "362428345",
      name: "Automobile spare part 362428345",
      price: 2499.0,
      code: "362428345",
      image: "/images/product-1.png", // You can replace with actual image
    },
    {
      id: "362428346",
      name: "Automobile spare part 362428346",
      price: 560.0,
      code: "362428346",
      image: "/images/product-2.png", // You can replace with actual image
    },
    {
      id: "362428347",
      name: "Engine Oil Filter",
      price: 45.5,
      code: "EOL-2024",
      image: "/images/product-3.png",
    },
    {
      id: "362428348",
      name: "Brake Pads Set",
      price: 189.99,
      code: "BPS-8901",
      image: "/images/product-4.png",
    },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-2xl lg:text-3xl font-semibold text-[#1A1A1A] mb-2">
        Cart Demo Page
      </h1>
      <p className="text-gray-600 mb-8">
        Click "Add to Cart" to test the cart functionality
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            {/* Product Image */}
            <div className="w-full h-40 rounded-xl bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={160}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <h3 className="text-base font-medium text-[#1A1A1A] mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{product.code}</p>

            {/* Price */}
            <p className="text-xl font-semibold text-[#1A1A1A] mb-4">
              {product.price.toFixed(2)} ₼
            </p>

            {/* Add to Cart Button */}
            <AddToCartButton product={product} className="w-full" />
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-xl">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">
          How to Use Redux Cart
        </h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">1. Add items to cart:</h3>
            <pre className="bg-white p-3 rounded-lg overflow-x-auto">
              {`import { useDispatch } from "react-redux";
import { basketService } from "@/lib/basketService";
import { addItem } from "@/store/cart";

const dispatch = useDispatch();

const response = await basketService.add(productId, 1);
dispatch(addItem(response));`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Remove items:</h3>
            <pre className="bg-white p-3 rounded-lg overflow-x-auto">
              {`import { basketService } from "@/lib/basketService";
import { removeItem } from "@/store/cart";

const response = await basketService.remove(productId);
dispatch(removeItem(response));`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Get cart info:</h3>
            <pre className="bg-white p-3 rounded-lg overflow-x-auto">
              {`import { useSelector } from "react-redux";
import { selectCartItems, selectBasketData, selectTotalItems } from "@/store/cart";

const cartItems = useSelector(selectCartItems);
const basketData = useSelector(selectBasketData);
const totalItems = useSelector(selectTotalItems);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
