"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export default function CarCard({ car, onEdit, onDelete, onSave }) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(car);

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(car);
    setIsEditing(false);
  };

  const handleSearchByCar = () => {
    // Navigate to products page with car filters
    console.log("Search by car:", car);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 lg:p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {car.image ? (
                <Image
                  src={car.image}
                  alt={car.brand}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Car className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <button className="text-sm text-[#4A90E2] cursor-pointer flex items-center gap-1">
              Fayl seç
              <Image
                src="/icons/edit-primary.svg"
                alt="file"
                width={20}
                height={20}
              />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(car.id)}
            className="text-[#EC5C30] border-[#EC5C30] hover:bg-[#EC5C30] hover:text-white cursor-pointer group px-4 py-2 rounded-full"
          >
            Sil
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
            <label className="text-sm text-gray-500 mb-2 block">Marka</label>
            <Select
              value={editData.brand}
              onValueChange={(value) =>
                setEditData({ ...editData, brand: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Audi">Audi</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Mercedes">Mercedes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Model</label>
            <Select
              value={editData.model}
              onValueChange={(value) =>
                setEditData({ ...editData, model: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R8">R8</SelectItem>
                <SelectItem value="A6">A6</SelectItem>
                <SelectItem value="Q7">Q7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Mühərrik həcmi
            </label>
            <Select
              value={editData.engine}
              onValueChange={(value) =>
                setEditData({ ...editData, engine: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5.2 L (5,200 sm³)">
                  5.2 L (5,200 sm³)
                </SelectItem>
                <SelectItem value="3.0 L (3,000 sm³)">
                  3.0 L (3,000 sm³)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Mühərrik nömrəsi
            </label>
            <Select
              value={editData.engineNumber}
              onValueChange={(value) =>
                setEditData({ ...editData, engineNumber: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABC1234567">ABC1234567</SelectItem>
                <SelectItem value="ABC7654321">ABC7654321</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Şassi (VIN) nömrəsi
            </label>
            <Select
              value={editData.vin}
              onValueChange={(value) =>
                setEditData({ ...editData, vin: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WF0AXXWPMAR123456">
                  WF0AXXWPMAR123456
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Yanacaq növü
            </label>
            <Select
              value={editData.fuelType}
              onValueChange={(value) =>
                setEditData({ ...editData, fuelType: value })
              }
            >
              <SelectTrigger className="w-full  rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Premium benzindən istifadə olunur">
                  Premium benzindən istifadə olunur
                </SelectItem>
                <SelectItem value="Dizel">Dizel</SelectItem>
                <SelectItem value="Elektrik">Elektrik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Oturacaq sayı
            </label>
            <Select
              value={editData.seats}
              onValueChange={(value) =>
                setEditData({ ...editData, seats: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2 (iki oturacaq)">
                  2 (iki oturacaq)
                </SelectItem>
                <SelectItem value="4 (dörd oturacaq)">
                  4 (dörd oturacaq)
                </SelectItem>
                <SelectItem value="5 (beş oturacaq)">
                  5 (beş oturacaq)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Avtomobil tipi
            </label>
            <Select
              value={editData.type}
              onValueChange={(value) =>
                setEditData({ ...editData, type: value })
              }
            >
              <SelectTrigger className="w-full rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="İdman avtomobili / coupe / supercar">
                  İdman avtomobili / coupe / supercar
                </SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Rəng</label>
            <Select
              value={editData.color}
              onValueChange={(value) =>
                setEditData({ ...editData, color: value })
              }
            >
              <SelectTrigger className="w-full  rounded-full border-gray-300 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ağ">Ağ</SelectItem>
                <SelectItem value="Qara">Qara</SelectItem>
                <SelectItem value="Gümüşü">Gümüşü</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4 justify-end">
            <Button
              onClick={handleSave}
              className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-6 text-base font-medium rounded-full"
            >
              Yadda saxla
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between gap-6">
          {/* Left side - Car info */}
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

          {/* Right side - Actions */}
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
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-10 h-10 cursor-pointer"
            >
              <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(car.id)}
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

      {/* Mobile Version */}
      <div className="lg:hidden bg-white rounded-2xl border-2 border-gray-200 p-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Car info */}
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

          {/* Edit and Delete icons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-9 h-9"
            >
              <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(car.id)}
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

        {/* Details */}
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
  );
}
