"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  yearOptions,
  profileCarsService,
  mapApiCarToUi,
} from "@/lib/profileCarsService";

const inputLikeClass =
  "w-full rounded-full border-gray-300 min-h-[48px] px-4 border bg-white";

const NONE = "none";

export default function CarCard({
  car,
  onDelete,
  onSave,
  libraries,
  onPhotoDeleted,
  onError,
}) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
  const [deleteCarSubmitting, setDeleteCarSubmitting] = useState(false);
  const [deletePhotoSubmitting, setDeletePhotoSubmitting] = useState(false);
  const [editData, setEditData] = useState(car);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editOpenLoading, setEditOpenLoading] = useState(false);
  const fileInputRef = useRef(null);
  const y0 = new Date().getFullYear();

  useEffect(() => {
    if (isEditing) return;
    setEditData(car);
    setPhotoFile(null);
    setPhotoPreview(null);
  }, [car, isEditing]);

  const brands = libraries?.brands ?? [];
  const carTypes = libraries?.carTypes ?? [];
  const fuelTypes = libraries?.fuelTypes ?? [];
  const transmissionTypes = libraries?.transmissionTypes ?? [];
  const engineVolumes = libraries?.engineVolumes ?? [];

  const selectedBrand = brands.find(
    (b) => String(b.id) === String(editData.brandId ?? "")
  );
  const brandModels = selectedBrand?.brand_models ?? [];

  const displayImage = photoPreview || editData.image;

  const handleSave = async () => {
    const bm = Number(editData.brandModelId);
    const ct = Number(editData.carTypeId);
    const yr = Number(editData.year);
    if (!Number.isFinite(bm) || bm <= 0) return;
    if (!Number.isFinite(ct) || ct <= 0) return;
    if (!Number.isFinite(yr) || yr < 1900 || yr > y0 + 1) return;

    const payload = {
      brandModelId: bm,
      carTypeId: ct,
      year: yr,
      engineVolumeId:
        editData.engineVolumeId && editData.engineVolumeId !== NONE
          ? Number(editData.engineVolumeId)
          : null,
      fuelTypeId:
        editData.fuelTypeId && editData.fuelTypeId !== NONE
          ? Number(editData.fuelTypeId)
          : null,
      transmissionTypeId:
        editData.transmissionTypeId &&
        editData.transmissionTypeId !== NONE
          ? Number(editData.transmissionTypeId)
          : null,
      engineNumber: editData.engineNumber ?? "",
      vin: editData.vin ?? "",
      photoFile,
      color: editData.color ?? "",
      seats: editData.seats ?? "",
    };

    const saved = await onSave(car.id, payload);
    if (saved === false) return;
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleCancel = () => {
    setEditData(car);
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const mergeListCosmetic = (fromApi, listCar) => ({
    ...fromApi,
    color: listCar?.color ?? fromApi.color ?? "",
    seats: listCar?.seats ?? fromApi.seats ?? "",
  });

  const openEdit = async () => {
    setEditOpenLoading(true);
    const res = await profileCarsService.showCar(car.id);
    setEditOpenLoading(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    if (res.success && res.car) {
      const mapped = mapApiCarToUi(res.car);
      if (mapped) {
        setEditData(mergeListCosmetic(mapped, car));
      } else {
        setEditData(car);
      }
    } else {
      setEditData(car);
    }
    setIsEditing(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteCarSubmitting(true);
    const ok = await onDelete(car.id);
    setDeleteCarSubmitting(false);
    if (ok !== false) {
      setShowDeleteModal(false);
    }
  };

  const handleConfirmDeletePhoto = async () => {
    setDeletePhotoSubmitting(true);
    const res = await profileCarsService.deleteCarPhoto(car.id);
    setDeletePhotoSubmitting(false);
    if (!res.success) {
      onError?.(res.error);
      return;
    }
    setEditData((prev) => ({ ...prev, image: null }));
    setPhotoPreview(null);
    setPhotoFile(null);
    onPhotoDeleted?.(car.id);
    setShowDeletePhotoModal(false);
  };

  const onPhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      {isEditing ? (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 lg:p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={editData.brand}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Car className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                className="text-sm text-[#4A90E2] cursor-pointer flex items-center gap-1"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("cars_select_file")}
                <Image
                  src="/icons/edit-primary.svg"
                  alt="file"
                  width={20}
                  height={20}
                />
              </button>
              {editData.image && !photoFile ? (
                <button
                  type="button"
                  className="text-sm text-[#EC5C30] cursor-pointer hover:underline text-left"
                  onClick={() => setShowDeletePhotoModal(true)}
                >
                  {t("cars_delete_photo")}
                </button>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoPick}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="text-[#EC5C30] border-[#EC5C30] hover:bg-[#EC5C30] hover:text-white cursor-pointer group px-4 py-2 rounded-full"
          >
            {t("cars_delete")}
            <Image
              src="/icons/delete-danger.svg"
              alt="delete"
              className="group-hover:brightness-0 group-hover:invert"
              width={20}
              height={20}
            />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              {t("cars_brand")}
            </label>
            <Select
              value={
                editData.brandId != null ? String(editData.brandId) : undefined
              }
              onValueChange={(value) =>
                setEditData((prev) => ({
                  ...prev,
                  brandId: value,
                  brandModelId: "",
                }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
              value={
                editData.brandModelId != null
                  ? String(editData.brandModelId)
                  : undefined
              }
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, brandModelId: value }))
              }
              disabled={!editData.brandId}
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
              value={editData.year ? String(editData.year) : undefined}
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, year: value }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
              value={
                editData.engineVolumeId != null
                  ? String(editData.engineVolumeId)
                  : NONE
              }
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, engineVolumeId: value }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
              value={editData.engineNumber ?? ""}
              onChange={(e) =>
                setEditData((prev) => ({
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
              value={editData.vin ?? ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, vin: e.target.value }))
              }
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              {t("cars_fuel_type")}
            </label>
            <Select
              value={
                editData.fuelTypeId != null
                  ? String(editData.fuelTypeId)
                  : NONE
              }
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, fuelTypeId: value }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
              value={
                editData.transmissionTypeId != null
                  ? String(editData.transmissionTypeId)
                  : NONE
              }
              onValueChange={(value) =>
                setEditData((prev) => ({
                  ...prev,
                  transmissionTypeId: value,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
            <Select
              value={editData.seats || undefined}
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, seats: value }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2 (iki oturacaq)">
                  {t("cars_seats_2")}
                </SelectItem>
                <SelectItem value="4 (dörd oturacaq)">
                  {t("cars_seats_4")}
                </SelectItem>
                <SelectItem value="5 (beş oturacaq)">
                  {t("cars_seats_5")}
                </SelectItem>
                <SelectItem value="7 (yeddi oturacaq)">
                  {t("cars_seats_7")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              {t("cars_type")}
            </label>
            <Select
              value={
                editData.carTypeId != null
                  ? String(editData.carTypeId)
                  : undefined
              }
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, carTypeId: value }))
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
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
              value={editData.color || undefined}
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, color: value }))
              }
            >
              <SelectTrigger className="w-full  rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ağ">{t("cars_color_white")}</SelectItem>
                <SelectItem value="Qara">{t("cars_color_black")}</SelectItem>
                <SelectItem value="Gümüşü">
                  {t("cars_color_silver")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4 justify-end">
            <Button
              onClick={handleSave}
              className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-6 text-base font-medium rounded-full"
            >
              {t("cars_save")}
            </Button>
          </div>
        </div>
      </div>
      ) : (
      <>
      <div className="hidden lg:block bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-32 h-32 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
              {car.image ? (
                <Image
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{car.year}</p>
              <p className="text-sm text-gray-600 mb-2">{car.color}</p>
              <p className="text-sm text-gray-500">
                {car.fuelType}, {car.engine}, {car.engineNumber}, {car.vin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ">
            <Button
              variant="primary"
              size="lg"
              className=" h-[48px] lg:h-[60px] cursor-pointer w-[300px]"
            >
              <Image src="/icons/car.svg" alt="car" width={20} height={20} />
              <span className="text-white text-sm lg:text-base font-light">
                {t("search_by_car")}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={openEdit}
              disabled={editOpenLoading}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-10 h-10 cursor-pointer"
            >
              <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-10 h-10 cursor-pointer"
            >
              <Image
                src="/icons/delete.svg"
                alt="trash"
                width={20}
                height={20}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-white rounded-2xl border-2 border-gray-200 p-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-24 h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
              {car.image ? (
                <Image
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{car.year}</p>
              <p className="text-sm text-gray-600">{car.color}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={openEdit}
              disabled={editOpenLoading}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-9 h-9"
            >
              <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-9 h-9"
            >
              <Image
                src="/icons/delete.svg"
                alt="trash"
                width={20}
                height={20}
              />
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4 px-1">
          {car.fuelType}, {car.engine}, {car.engineNumber}, {car.vin}
        </p>

        <Button
          variant="primary"
          size="lg"
          className=" h-[48px] lg:h-[60px] cursor-pointer w-full"
        >
          <Image src="/icons/car.svg" alt="car" width={20} height={20} />
          <span className="text-white text-sm lg:text-base font-light">
            {t("search_by_car")}
          </span>
        </Button>
      </div>
      </>
      )}

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
              {t("cars_delete_confirm_title")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 pt-2">
              {t("cars_delete_confirm_line1")}
              <br />
              {t("cars_delete_confirm_line2")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleConfirmDelete}
              disabled={deleteCarSubmitting}
              className="flex-1 border-[#EC5C30] text-[#EC5C30] hover:bg-[#EC5C30]/10 hover:text-red-500 cursor-pointer rounded-full h-12 text-base font-medium"
            >
              {t("cars_delete")}
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="primary"
              disabled={deleteCarSubmitting}
              className="flex-1 text-white rounded-full h-12 text-base font-medium cursor-pointer"
            >
              {t("cars_cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeletePhotoModal}
        onOpenChange={setShowDeletePhotoModal}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
              {t("cars_delete_photo_confirm_title")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 pt-2">
              {t("cars_delete_photo_confirm_line1")}
              <br />
              {t("cars_delete_photo_confirm_line2")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleConfirmDeletePhoto}
              disabled={deletePhotoSubmitting}
              className="flex-1 border-[#EC5C30] text-[#EC5C30] hover:bg-[#EC5C30]/10 hover:text-red-500 cursor-pointer rounded-full h-12 text-base font-medium"
            >
              {t("cars_delete")}
            </Button>
            <Button
              onClick={() => setShowDeletePhotoModal(false)}
              variant="primary"
              disabled={deletePhotoSubmitting}
              className="flex-1 text-white rounded-full h-12 text-base font-medium cursor-pointer"
            >
              {t("cars_cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
