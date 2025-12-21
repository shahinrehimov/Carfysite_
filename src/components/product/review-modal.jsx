"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Plus, X } from "lucide-react";
import Image from "next/image";

// Validation schema
const reviewSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, "Xahiş edirik məhsulu qiymətləndirin")
    .required("Xahiş edirik məhsulu qiymətləndirin"),
  comment: yup
    .string()
    .min(10, "Rəy ən azı 10 simvoldan ibarət olmalıdır")
    .required("Rəy yazın"),
  images: yup.array().of(yup.mixed()),
});

export default function ReviewModal({ isOpen, onClose, product }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      images: [],
    },
  });

  const currentRating = watch("rating");

  const onSubmit = async (data) => {
    try {
      console.log("Review submitted:", data);
      // Here you would typically send the data to your API
      // await submitReview(data);

      // Show success message (you can add a toast notification here)
      alert("Rəyiniz üçün təşəkkür edirik!");

      // Reset form and close modal
      reset();
      setUploadedImages([]);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Xəta baş verdi. Xahiş edirik yenidən cəhd edin.");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;

    if (uploadedImages.length + files.length > maxImages) {
      alert(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz`);
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...uploadedImages, ...newImages];
    setUploadedImages(updatedImages);
    setValue("images", updatedImages);
  };

  const removeImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleClose = () => {
    reset();
    setUploadedImages([]);
    setHoveredStar(0);
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
          Məhsulu qiymətləndir
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
              Məhsula qiymət verin
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

          {/* Comment */}
          <div>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Rey yaz"
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00569C] focus:border-transparent transition-all ${
                    errors.comment ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.comment && (
              <p className="mt-2 text-sm text-red-600">
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Məhsulun şəkillərini əlavə et
            </label>

            <div className="flex flex-wrap gap-3">
              {/* Uploaded Images */}
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {uploadedImages.length < 5 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#00569C] hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Plus className="w-6 h-6 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          {/* Agreement Text */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Rəylərdə adınızın göstərilməsinə və ya məlumatlarımızın platformda
            miqyasında istifadəsinə razılıq verirəm
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Göndərilir..." : "Göndər"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

