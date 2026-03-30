"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ images, productTitle }) {
  const imagesList = images.filter((image) => image !== null);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 aspect-square flex items-center justify-center p-8 lg:p-12">
        <Image
          src={imagesList[selectedImage]}
          alt={productTitle}
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-6 gap-2 lg:gap-3">
        {imagesList.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all p-1.5 lg:p-2 ${
              selectedImage === index
                ? "border-[#0066FF]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={image}
              alt={`${productTitle} ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
