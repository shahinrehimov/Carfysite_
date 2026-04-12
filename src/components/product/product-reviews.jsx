"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReviewModal from "./review-modal";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { api } from "@/lib/axios/api";

function ImageLightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === "ArrowRight") setIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
          {index + 1} / {images.length}
        </span>
      )}

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`Preview ${index + 1}`}
          width={1200}
          height={900}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2 left-1/2 -translate-x-1/2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                i === index ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumb ${i + 1}`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductReviews({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const t = useTranslations();
  const router = useRouter();

  const fetchReviews = useCallback(
    async (page = 1, append = false) => {
      try {
        const response = await api.get(
          `/products/${data.uuid}/reviews/load?page=${page}`
        );
        const { data: items, meta } = response.data;
        setReviews((prev) => (append ? [...prev, ...items] : items));
        setCurrentPage(meta.current_page);
        setLastPage(meta.last_page);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    [data.uuid]
  );

  useEffect(() => {
    setLoading(true);
    fetchReviews(1, false).finally(() => setLoading(false));
  }, [fetchReviews]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchReviews(currentPage + 1, true);
    setLoadingMore(false);
  };

  const handleOpenModal = () => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setIsModalOpen(true);
  };

  const averageRating = data.ratings?.average ?? 0;

  const renderStars = (rating, size = "w-5 h-5") => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < Math.floor(rating)
            ? "fill-[#FF8A00] text-[#FF8A00]"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const maskName = (name) => {
    if (!name || name.length <= 1) return "A*****";
    return name.charAt(0) + "*****";
  };

  return (
    <div className="pb-10 mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
            {t("product_reviews")}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(averageRating, "w-6 h-6")}</div>
            <span className="text-lg font-medium text-gray-700">
              ({averageRating})
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="default"
          className="rounded-full px-6"
          onClick={handleOpenModal}
        >
          {t("write_review")}
        </Button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{t("no_reviews")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#C6D9E8] flex items-center justify-center shrink-0">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 4c-5.3 0-16 2.7-16 8v4h32v-4c0-5.3-10.7-8-16-8z"
                      fill="#8BA3B5"
                    />
                  </svg>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {maskName(review.name)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium text-gray-700">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                    {review.review}
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {review.images.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setLightbox({ images: review.images, index })
                          }
                          className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-[#00569C] hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#00569C]"
                        >
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && currentPage < lastPage && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-[#00569C] hover:text-[#00569C]/80 font-medium text-sm underline disabled:opacity-50"
          >
            {loadingMore ? t("loading") : t("show_more")}
          </button>
        </div>
      )}

      {/* Image Lightbox */}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={data}
      />
    </div>
  );
}
