"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/product/product-card";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function BestSeller({ products = [] }) {
  const t = useTranslations();

  return (
    <div className="pt-4 lg:pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="lg:text-[24px] font-medium lg:font-semibold text-gray-900">
          {t("best_sellers")}
        </h2>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        style={{ alignItems: "stretch", paddingBottom: "40px" }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        className="best-seller-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.uuid} className="h-auto">
            <div className="h-full">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .best-seller-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .best-seller-swiper .swiper-slide {
          height: auto;
        }
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
