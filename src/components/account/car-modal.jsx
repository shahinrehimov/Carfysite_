"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
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

export default function CarModal({ isOpen, onClose, onSave, car = null }) {
  const [formData, setFormData] = useState(
    car || {
      brand: "",
      model: "",
      engine: "",
      engineNumber: "",
      vin: "",
      fuelType: "",
      seats: "",
      type: "",
      color: "",
      image: null,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Yeni maşın əlavə et
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Car"
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
                Fayl seç
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Brand */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Marka</label>
              <Select
                value={formData.brand}
                onValueChange={(value) =>
                  setFormData({ ...formData, brand: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Audi">Audi</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Mercedes">Mercedes</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Model</label>
              <Select
                value={formData.model}
                onValueChange={(value) =>
                  setFormData({ ...formData, model: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R8">R8</SelectItem>
                  <SelectItem value="A6">A6</SelectItem>
                  <SelectItem value="Q7">Q7</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Engine */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Mühərrik həcmi
              </label>
              <Select
                value={formData.engine}
                onValueChange={(value) =>
                  setFormData({ ...formData, engine: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5.2 L (5,200 sm³)">
                    5.2 L (5,200 sm³)
                  </SelectItem>
                  <SelectItem value="3.0 L (3,000 sm³)">
                    3.0 L (3,000 sm³)
                  </SelectItem>
                  <SelectItem value="2.0 L (2,000 sm³)">
                    2.0 L (2,000 sm³)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Engine Number */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Mühərrik nömrəsi
              </label>
              <Select
                value={formData.engineNumber}
                onValueChange={(value) =>
                  setFormData({ ...formData, engineNumber: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABC1234567">ABC1234567</SelectItem>
                  <SelectItem value="ABC7654321">ABC7654321</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VIN */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Şassi (VIN) nömrəsi
              </label>
              <Select
                value={formData.vin}
                onValueChange={(value) =>
                  setFormData({ ...formData, vin: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WF0AXXWPMAR123456">
                    WF0AXXWPMAR123456
                  </SelectItem>
                  <SelectItem value="WF0AXXWPMAR654321">
                    WF0AXXWPMAR654321
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Yanacaq növü
              </label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) =>
                  setFormData({ ...formData, fuelType: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premium benzindən istifadə olunur">
                    Premium benzindən istifadə olunur
                  </SelectItem>
                  <SelectItem value="Benzin">Benzin</SelectItem>
                  <SelectItem value="Dizel">Dizel</SelectItem>
                  <SelectItem value="Elektrik">Elektrik</SelectItem>
                  <SelectItem value="Hibrid">Hibrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seats */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Oturacaq sayı
              </label>
              <Select
                value={formData.seats}
                onValueChange={(value) =>
                  setFormData({ ...formData, seats: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
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
                  <SelectItem value="7 (yeddi oturacaq)">
                    7 (yeddi oturacaq)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Car Type */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Avtomobil tipi
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="İdman avtomobili / coupe / supercar">
                    İdman avtomobili / coupe / supercar
                  </SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Hetçbek">Hetçbek</SelectItem>
                  <SelectItem value="Kupe">Kupe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Rəng</label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({ ...formData, color: value })
                }
              >
                <SelectTrigger className="w-full rounded-full border-gray-300">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ağ">Ağ</SelectItem>
                  <SelectItem value="Qara">Qara</SelectItem>
                  <SelectItem value="Gümüşü">Gümüşü</SelectItem>
                  <SelectItem value="Qırmızı">Qırmızı</SelectItem>
                  <SelectItem value="Mavi">Mavi</SelectItem>
                  <SelectItem value="Yaşıl">Yaşıl</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white py-6 text-base font-medium rounded-full"
            >
              Əlavə et
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
