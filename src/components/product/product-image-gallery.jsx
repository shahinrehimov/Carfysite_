"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

export default function ProductImageGallery({ images, productTitle }) {
  const imagesList = images.filter((image) => image !== null);
  const [selectedImage, setSelectedImage] = useState(0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const total = imagesList.length;

  const goPrev = () =>
    setSelectedImage((prev) => (prev - 1 + total) % total);
  const goNext = () => setSelectedImage((prev) => (prev + 1) % total);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current > threshold) {
      goPrev();
    } else if (touchDeltaX.current < -threshold) {
      goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 aspect-square"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding track */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${selectedImage * 100}%)` }}
          >
            {imagesList.map((image, index) => (
              <div
                key={index}
                className="w-full h-full shrink-0 flex items-center justify-center p-8 lg:p-12"
              >
                <Image
                  src={image}
                  alt={`${productTitle} ${index + 1}`}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {total > 1 && (
          <>
            {/* Prev arrow (desktop only) */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-[#0066FF]"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Next arrow (desktop only) */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-[#0066FF]"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Dots (mobile only) */}
            <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {imagesList.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedImage === index
                      ? "w-4 bg-[#0066FF]"
                      : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
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
