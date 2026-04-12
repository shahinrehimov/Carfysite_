import { api } from "./axios/api";

/**
 * Map API user car resource to UI shape used by account car components.
 * @param {object} row
 */
export function mapApiCarToUi(row) {
  if (!row) return null;
  return {
    id: row.id,
    brand: row.brand?.title ?? "",
    model: row.brand_model?.title ?? "",
    year: row.year != null ? String(row.year) : "",
    color: row.car_color?.title ?? "",
    colorId: row.car_color?.id != null ? row.car_color.id : null,
    fuelType: row.fuel_type?.title ?? "",
    engine: row.engine_volume?.title ?? "",
    engineNumber: row.engine_number ?? "",
    vin: row.vin_number ?? "",
    seats: row.seat_count != null ? String(row.seat_count) : "",
    type: row.car_type?.title ?? "",
    image: row.photo || null,
    transmissionType: row.transmission_type?.title ?? "",
    brandId: row.brand?.id ?? null,
    brandModelId: row.brand_model?.id ?? null,
    carTypeId: row.car_type?.id ?? null,
    engineVolumeId: row.engine_volume?.id ?? null,
    fuelTypeId: row.fuel_type?.id ?? null,
    transmissionTypeId: row.transmission_type?.id ?? null,
  };
}

/**
 * POST add/update: { data: { message?, data: car } } və ya { data: car }
 * GET show: { data: { id, brand, brand_model, ... } }
 */
function extractCarPayload(res) {
  const body = res?.data;
  const inner = body?.data;
  if (inner && typeof inner === "object") {
    if (inner.id != null) return inner;
    if (inner.data && typeof inner.data === "object" && inner.data.id != null) {
      return inner.data;
    }
  }
  if (body && body.id != null) return body;
  return null;
}

export const profileCarsService = {
  async loadCars(limit = 50) {
    try {
      const response = await api.get("/profile/cars/load", {
        params: { limit },
      });
      const rows = response.data?.data ?? [];
      const meta = response.data?.meta ?? null;
      return { success: true, data: rows, meta };
    } catch (error) {
      console.error("Load cars error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to load cars",
        data: [],
      };
    }
  },

  async showCar(carId) {
    try {
      const response = await api.get(`/profile/cars/show/${carId}`);
      const row = response.data?.data;
      const ok =
        row &&
        typeof row === "object" &&
        row.id != null;
      return ok
        ? { success: true, car: row }
        : {
            success: false,
            error: "Invalid car response",
            car: null,
          };
    } catch (error) {
      console.error("Show car error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to load car",
        car: null,
      };
    }
  },

  async deleteCar(carId) {
    try {
      const response = await api.delete(
        `/profile/cars/delete/${carId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Delete car error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete car",
      };
    }
  },

  async deleteCarPhoto(carId) {
    try {
      const response = await api.delete(
        `/profile/cars/delete-photo/${carId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Delete car photo error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete photo",
      };
    }
  },

  /**
   * @param {FormData} formData
   */
  async addCar(formData) {
    try {
      const response = await api.post("/profile/cars/add", formData);
      const car = extractCarPayload(response);
      return { success: true, data: response.data, car };
    } catch (error) {
      console.error("Add car error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to add car",
      };
    }
  },

  /**
   * @param {number|string} carId
   * @param {FormData} formData
   */
  async updateCar(carId, formData) {
    try {
      const response = await api.post(
        `/profile/cars/update/${carId}`,
        formData
      );
      const car = extractCarPayload(response);
      return { success: true, data: response.data, car };
    } catch (error) {
      console.error("Update car error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update car",
      };
    }
  },

  async loadCarLibraries() {
    try {
      const [
        brandsRes,
        carTypesRes,
        fuelTypesRes,
        transmissionRes,
        engineVolumesRes,
        colorsRes,
      ] = await Promise.all([
        api.get("/car-libraries/brands", { params: { with_models: "yes" } }),
        api.get("/car-libraries/car-types"),
        api.get("/car-libraries/fuel-types"),
        api.get("/car-libraries/transmission-types"),
        api.get("/car-libraries/engine-volumes"),
        api.get("/car-libraries/car-colors"),
      ]);

      return {
        success: true,
        data: {
          brands: brandsRes.data?.data ?? [],
          carTypes: carTypesRes.data?.data ?? [],
          fuelTypes: fuelTypesRes.data?.data ?? [],
          transmissionTypes: transmissionRes.data?.data ?? [],
          engineVolumes: engineVolumesRes.data?.data ?? [],
          colors: colorsRes.data?.data ?? [],
        },
      };
    } catch (error) {
      console.error("Load car libraries error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to load car libraries",
        data: {
          brands: [],
          carTypes: [],
          fuelTypes: [],
          transmissionTypes: [],
          engineVolumes: [],
          colors: [],
        },
      };
    }
  },
};

/**
 * Build multipart body for add/update from normalized form values.
 * @param {object} v
 * @param {File|null} [v.photoFile]
 */
export function buildCarFormData(v) {
  const fd = new FormData();
  fd.append("brand_model_id", String(v.brandModelId));
  fd.append("car_type_id", String(v.carTypeId));
  fd.append("year", String(v.year));
  if (v.engineVolumeId) {
    fd.append("engine_volume_id", String(v.engineVolumeId));
  }
  if (v.fuelTypeId) {
    fd.append("fuel_type_id", String(v.fuelTypeId));
  }
  if (v.transmissionTypeId) {
    fd.append("transmission_type_id", String(v.transmissionTypeId));
  }
  if (v.engineNumber) {
    fd.append("engine_number", String(v.engineNumber).slice(0, 100));
  }
  if (v.vin) {
    fd.append("vin_number", String(v.vin).slice(0, 100));
  }
  if (v.colorId) {
    fd.append("car_color_id", String(v.colorId));
  }
  if (v.seats) {
    fd.append("seat_count", String(v.seats));
  }
  if (v.photoFile instanceof File) {
    fd.append("photo", v.photoFile);
  }
  return fd;
}

const currentY = () => new Date().getFullYear();

export function yearOptions() {
  const max = currentY() + 1;
  const out = [];
  for (let y = max; y >= 1900; y -= 1) {
    out.push(y);
  }
  return out;
}
