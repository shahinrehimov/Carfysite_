"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, X, Plus, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { getUserData } from "@/lib/auth";
import { api } from "@/lib/axios/api";
import { useTranslations } from "next-intl";

const buildReviewSchema = (t) =>
  yup.object().shape({
    rating: yup
      .number()
      .min(1, t("please_rate_product"))
      .required(t("please_rate_product")),
    review: yup
      .string()
      .min(10, t("review_min_length"))
      .required(t("write_review")),
  });

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        isSuccess
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-red-50 border border-red-200 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
      )}
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ReviewModal({ isOpen, onClose, product }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [images, setImages] = useState([]);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const t = useTranslations();
  const userData = getUserData();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(buildReviewSchema(t)),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data) => {
    setToast(null);
    try {
      const formData = new FormData();
      formData.append("rating", data.rating);
      formData.append("name", userData?.name || "");
      formData.append("surname", userData?.surname || "");
      formData.append("email", userData?.email || "");
      formData.append("review", data.review);
      images.forEach((img) => {
        formData.append("images[]", img.file);
      });

      await api.post(`/products/${product?.uuid}/reviews/store`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ type: "success", message: t("thank_you_for_review") });
      reset();
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);

      setTimeout(() => {
        setToast(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setToast({ type: "error", message: t("error_occurred") });
    }
  };

  const handleClose = () => {
    reset();
    setHoveredStar(0);
    setToast(null);
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    onClose();
  };

  const renderStars = (value, onChange) => {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const isFilled =
            hoveredStar > 0 ? starValue <= hoveredStar : starValue <= value;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHoveredStar(starValue)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  isFilled
                    ? "fill-[#FF8A00] text-[#FF8A00]"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold text-gray-900">
          {t("rate_product")}
        </DialogTitle>

        <Toast toast={toast} onDismiss={() => setToast(null)} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {product?.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {product?.title}
              </h3>
              <p className="text-sm text-gray-500">{product?.productCode}</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              {t("give_product_rating")}
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex justify-center">
                  {renderStars(field.value, field.onChange)}
                </div>
              )}
            />
            {errors.rating && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Review */}
          <div>
            <Controller
              name="review"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder={t("write_review_placeholder")}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00569C] focus:border-transparent transition-all ${
                    errors.review ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.review && (
              <p className="mt-2 text-sm text-red-600">
                {errors.review.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />

            {images.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <Image
                      src={img.preview}
                      alt={`upload-${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#00569C] transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-6 flex flex-col items-center justify-center gap-2 hover:border-[#00569C] transition-colors group"
              >
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#00569C] transition-colors" />
                <span className="text-sm text-gray-500 group-hover:text-[#00569C] transition-colors">
                  {t("add_product_images")}
                </span>
              </button>
            )}
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="review-agreement"
              className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-[#00569C]"
            />
            <label
              htmlFor="review-agreement"
              className="text-xs text-gray-500 leading-relaxed cursor-pointer"
            >
              {t("review_agreement")}
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("sending") : t("send")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
