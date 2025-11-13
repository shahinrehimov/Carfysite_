"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import ProductCard from "@/components/product/product-card";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const products = [
  {
    id: 1,
    image: "/images/product-1.png",
    title: "Automobile spare part",
    code: "362428345",
    price: 365.0,
    oldPrice: 365.0,
    rating: 5,
    reviews: 72,
  },
  {
    id: 2,
    image: "/images/product-2.png",
    title: "Automobile spare part",
    code: "362428345",
    price: 365.0,
    oldPrice: 365.0,
    rating: 5,
    reviews: 72,
  },
  {
    id: 3,
    image: "/images/product-3.png",
    title: "Automobile spare part",
    code: "362428345",
    price: 365.0,
    oldPrice: 365.0,
    rating: 5,
    reviews: 72,
  },
  {
    id: 4,
    image: "/images/product-4.png",
    title: "Automobile spare part",
    code: "362428345",
    price: 365.0,
    oldPrice: 365.0,
    rating: 5,
    reviews: 72,
  },
  {
    id: 5,
    image: "/images/product-1.png",
    title: "Automobile spare part",
    code: "362428345",
    price: 365.0,
    oldPrice: 365.0,
    rating: 5,
    reviews: 72,
  },
];

function BestSeller() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-semibold text-gray-900">
          Ən çox satılan məhsullar
        </h2>
        <Link
          href="#"
          className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors underline"
        >
          Hamısı
        </Link>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="best-seller-swiper"
        style={{ paddingBottom: "40px" }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .best-seller-swiper .swiper-pagination {
          bottom: 0px !important;
        }
        .best-seller-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          margin: 0 4px !important;
        }
        .best-seller-swiper .swiper-pagination-bullet-active {
          background: #ff6b35;
        }
      `}</style>
    </div>
  );
}

export default BestSeller;
