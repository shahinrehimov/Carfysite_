"use client";

import { useState, useEffect, useCallback } from "react";
import CarCard from "@/components/account/car-card";
import AddCarCard from "@/components/account/add-car-card";
import CarModal from "@/components/account/car-modal";
import { useTranslations } from "next-intl";
import {
  profileCarsService,
  mapApiCarToUi,
  buildCarFormData,
} from "@/lib/profileCarsService";

function mergeCosmeticFromForm(apiUi, form) {
  if (!apiUi) return apiUi;
  return {
    ...apiUi,
    color: form.color ?? "",
    seats: form.seats ?? "",
  };
}

export default function MyCarsPage() {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [libraries, setLibraries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refreshCars = useCallback(async () => {
    const res = await profileCarsService.loadCars(100);
    if (res.success) {
      setCars((res.data || []).map(mapApiCarToUi).filter(Boolean));
      setLoadError(null);
    } else {
      setLoadError(res.error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [libRes, carsRes] = await Promise.all([
        profileCarsService.loadCarLibraries(),
        profileCarsService.loadCars(100),
      ]);
      if (cancelled) return;
      if (libRes.success) {
        setLibraries(libRes.data);
      }
      if (carsRes.success) {
        setCars((carsRes.data || []).map(mapApiCarToUi).filter(Boolean));
        setLoadError(null);
      } else {
        setLoadError(carsRes.error);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddCar = async (formPayload) => {
    const fd = buildCarFormData(formPayload);
    const res = await profileCarsService.addCar(fd);
    if (!res.success) {
      setLoadError(res.error);
      return false;
    }
    const mapped = mapApiCarToUi(res.car);
    if (mapped) {
      setCars((prev) => [...prev, mergeCosmeticFromForm(mapped, formPayload)]);
    } else {
      await refreshCars();
    }
    return true;
  };

  const handleSaveCar = async (carId, formPayload) => {
    const fd = buildCarFormData(formPayload);
    const res = await profileCarsService.updateCar(carId, fd);
    if (!res.success) {
      setLoadError(res.error);
      return false;
    }
    const mapped = mapApiCarToUi(res.car);
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== carId) return c;
        if (mapped) return mergeCosmeticFromForm(mapped, formPayload);
        return mergeCosmeticFromForm({ ...c, ...formPayload }, formPayload);
      })
    );
    return true;
  };

  const handleDeleteCar = async (carId) => {
    const res = await profileCarsService.deleteCar(carId);
    if (!res.success) {
      setLoadError(res.error);
      return false;
    }
    setCars((prev) => prev.filter((car) => car.id !== carId));
    return true;
  };

  const handlePhotoDeleted = (carId) => {
    setCars((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, image: null } : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 hidden lg:block">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          {t("my_cars")}
        </h1>
      </div>

      {loadError ? (
        <p className="text-sm text-red-600" role="alert">
          {loadError}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-500">{t("cars_loading")}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-6">
        {!loading &&
          cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              libraries={libraries}
              onDelete={handleDeleteCar}
              onSave={handleSaveCar}
              onPhotoDeleted={handlePhotoDeleted}
              onError={setLoadError}
            />
          ))}

        {!loading && <AddCarCard onClick={() => setIsModalOpen(true)} />}
      </div>

      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCar}
        libraries={libraries}
      />
    </div>
  );
}
