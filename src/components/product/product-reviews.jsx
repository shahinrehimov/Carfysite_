"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import ReviewModal from "./review-modal";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ProductReviews({ data }) {
  console.log(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations();
  const [displayCount, setDisplayCount] = useState(4);

  const averageRating = data.ratings.average;
  // Calculate average rating
  // const averageRating =
  //   reviews.length > 0
  //     ? (
  //         reviews.reduce((acc, review) => acc + review.rating, 0) /
  //         reviews.length
  //       ).toFixed(1)
  //     : 0;

  // Display limited reviews
  const displayedReviews = data.reviews.slice(0, displayCount);
  const hasMoreReviews = data.reviews.length > displayCount;

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avqust",
      "sentyabr",
      "oktyabr",
      "noyabr",
      "dekabr",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const maskUsername = (username) => {
    if (!username || username.length <= 1) return "A*****";
    return username.charAt(0) + "*****";
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
          onClick={() => setIsModalOpen(true)}
        >
          {t("write_review")}
        </Button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{t("no_reviews")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
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
                        {maskUsername(review.username)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(review.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium text-gray-700">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Review Images */}
                  {/* {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className="text-center mt-6">
          <button
            onClick={() => setDisplayCount((prev) => prev + 4)}
            className="text-[#00569C] hover:text-[#00569C]/80 font-medium text-sm underline"
          >
            {t("show_more")}
          </button>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </div>
  );
}
