"use client";

import { useState } from "react";
import CarCard from "@/components/account/car-card";
import AddCarCard from "@/components/account/add-car-card";
import CarModal from "@/components/account/car-modal";
import { useTranslations } from "next-intl";

export default function MyCarsPage() {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cars, setCars] = useState([
    {
      id: 1,
      brand: "Audi",
      model: "R8",
      year: "2018",
      color: "Ağ rəng",
      fuelType: "Benzin",
      engine: "1998 sm³",
      engineNumber: "ABC1234567",
      vin: "WF0AXXWPMAR123456",
      seats: "2 (iki oturacaq)",
      type: "İdman avtomobili / coupe / supercar",
      image: "/images/product-1.png",
    },
  ]);

  const handleAddCar = (newCar) => {
    setCars([...cars, { ...newCar, id: Date.now(), year: "2024" }]);
  };

  const handleSaveCar = (updatedCar) => {
    setCars(cars.map((car) => (car.id === updatedCar.id ? updatedCar : car)));
  };

  const handleDeleteCar = (carId) => {
    if (confirm("Maşını silmək istədiyinizdən əminsiniz?")) {
      setCars(cars.filter((car) => car.id !== carId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          {t("my_cars")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onEdit={() => {}}
            onDelete={handleDeleteCar}
            onSave={handleSaveCar}
          />
        ))}

        <AddCarCard onClick={() => setIsModalOpen(true)} />
      </div>

      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCar}
      />
    </div>
  );
}
