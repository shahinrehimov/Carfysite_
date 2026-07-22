"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { yearOptions } from "@/lib/profileCarsService";

const inputLikeClass =
  "w-full rounded-full border-gray-300 min-h-[48px] px-4 border bg-white";

const NONE = "none";

export default function CarModal({ isOpen, onClose, onSave, car = null, libraries }) {
  const t = useTranslations();
  const y0 = new Date().getFullYear();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brandId: "",
    brandModelId: "",
    carTypeId: "",
    year: String(y0),
    engineVolumeId: NONE,
    fuelTypeId: NONE,
    transmissionTypeId: NONE,
    engineNumber: "",
    vin: "",
    fuelType: "",
    seats: "",
    type: "",
    colorId: "",
    imagePreview: null,
    photoFile: null,
  });

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setSubmitting(false);
    if (car) {
      setFormData({
        brandId: car.brandId != null ? String(car.brandId) : "",
        brandModelId: car.brandModelId != null ? String(car.brandModelId) : "",
        carTypeId: car.carTypeId != null ? String(car.carTypeId) : "",
        year: car.year ? String(car.year) : String(y0),
        engineVolumeId:
          car.engineVolumeId != null ? String(car.engineVolumeId) : NONE,
        fuelTypeId: car.fuelTypeId != null ? String(car.fuelTypeId) : NONE,
        transmissionTypeId:
          car.transmissionTypeId != null
            ? String(car.transmissionTypeId)
            : NONE,
        engineNumber: car.engineNumber ?? "",
        vin: car.vin ?? "",
        fuelType: car.fuelType ?? "",
        seats: car.seats ?? "",
        type: car.type ?? "",
        colorId: car.colorId != null ? String(car.colorId) : "",
        imagePreview: car.image || null,
        photoFile: null,
      });
    } else {
      setFormData({
        brandId: "",
        brandModelId: "",
        carTypeId: "",
        year: String(y0),
        engineVolumeId: NONE,
        fuelTypeId: NONE,
        transmissionTypeId: NONE,
        engineNumber: "",
        vin: "",
        fuelType: "",
        seats: "",
        type: "",
        colorId: "",
        imagePreview: null,
        photoFile: null,
      });
    }
  }, [isOpen, car, y0]);

  const brands = libraries?.brands ?? [];
  const carTypes = libraries?.carTypes ?? [];
  const fuelTypes = libraries?.fuelTypes ?? [];
  const transmissionTypes = libraries?.transmissionTypes ?? [];
  const engineVolumes = libraries?.engineVolumes ?? [];
  const colors = libraries?.colors ?? [];

  const selectedBrand = brands.find(
    (b) => String(b.id) === String(formData.brandId)
  );
  const brandModels = selectedBrand?.brand_models ?? [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bm = Number(formData.brandModelId);
    const ct = Number(formData.carTypeId);
    const yr = Number(formData.year);
    if (!Number.isFinite(bm) || bm <= 0) return;
    if (!Number.isFinite(ct) || ct <= 0) return;
    if (!Number.isFinite(yr) || yr < 1900 || yr > y0 + 1) return;

    const payload = {
      brandModelId: bm,
      carTypeId: ct,
      year: yr,
      engineVolumeId:
        formData.engineVolumeId && formData.engineVolumeId !== NONE
          ? Number(formData.engineVolumeId)
          : null,
      fuelTypeId:
        formData.fuelTypeId && formData.fuelTypeId !== NONE
          ? Number(formData.fuelTypeId)
          : null,
      transmissionTypeId:
        formData.transmissionTypeId &&
        formData.transmissionTypeId !== NONE
          ? Number(formData.transmissionTypeId)
          : null,
      engineNumber: formData.engineNumber,
      vin: formData.vin,
      photoFile: formData.photoFile,
      colorId: formData.colorId ? Number(formData.colorId) : null,
      color: colors.find((c) => String(c.id) === formData.colorId)?.title ?? "",
      seats: formData.seats,
    };

    setError("");
    setSubmitting(true);
    const res = await onSave(payload);
    setSubmitting(false);

    if (res && res.success === false) {
      setError(res.error || t("error_occurred"));
      return;
    }
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagePreview: reader.result,
          photoFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("cars_add_modal_title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {formData.imagePreview ? (
                <Image
                  src={formData.imagePreview}
                  alt={t("cars_image_preview_alt")}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-sm text-[#4A90E2] hover:underline">
                {t("cars_select_file")}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_brand")}
              </label>
              <Select
                value={formData.brandId || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    brandId: value,
                    brandModelId: "",
                  }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_model")}
              </label>
              <Select
                value={formData.brandModelId || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, brandModelId: value }))
                }
                disabled={!formData.brandId}
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {brandModels.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_year")}
              </label>
              <Select
                value={formData.year || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, year: value }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-[240px]">
                  {yearOptions().map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_engine_volume")}
              </label>
              <Select
                value={formData.engineVolumeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, engineVolumeId: value }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>{t("cars_optional_dash")}</SelectItem>
                  {engineVolumes.map((ev) => (
                    <SelectItem key={ev.id} value={String(ev.id)}>
                      {ev.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_engine_number")}
              </label>
              <Input
                className={inputLikeClass}
                value={formData.engineNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    engineNumber: e.target.value,
                  }))
                }
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_vin")}
              </label>
              <Input
                className={inputLikeClass}
                value={formData.vin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, vin: e.target.value }))
                }
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_fuel_type")}
              </label>
              <Select
                value={formData.fuelTypeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, fuelTypeId: value }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>{t("cars_optional_dash")}</SelectItem>
                  {fuelTypes.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_transmission")}
              </label>
              <Select
                value={formData.transmissionTypeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    transmissionTypeId: value,
                  }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>{t("cars_optional_dash")}</SelectItem>
                  {transmissionTypes.map((tt) => (
                    <SelectItem key={tt.id} value={String(tt.id)}>
                      {tt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_seats")}
              </label>
              <Input
                type="number"
                min={1}
                max={99}
                className={inputLikeClass}
                value={formData.seats}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seats: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_type")}
              </label>
              <Select
                value={formData.carTypeId || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, carTypeId: value }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {carTypes.map((ct) => (
                    <SelectItem key={ct.id} value={String(ct.id)}>
                      {ct.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                {t("cars_color")}
              </label>
              <Select
                value={formData.colorId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, colorId: value }))
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                  <SelectValue placeholder={t("cars_select_placeholder")}>
                    {formData.colorId
                      ? (() => {
                          const found = colors.find(
                            (c) => String(c.id) === formData.colorId
                          );
                          return (
                            <span className="flex items-center gap-2">
                              {found && (
                                <span
                                  className="inline-block w-4 h-4 rounded-full border border-gray-300 shrink-0"
                                  style={{ backgroundColor: found.hex_code }}
                                />
                              )}
                              {found?.title ?? formData.colorId}
                            </span>
                          );
                        })()
                      : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: c.hex_code }}
                        />
                        {c.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            {error ? (
              <p
                className="mb-3 text-sm text-red-600 text-center"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-6 text-base font-medium rounded-full disabled:opacity-60"
            >
              {t("cars_add_submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
