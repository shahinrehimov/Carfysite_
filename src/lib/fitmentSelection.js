import { api } from "@/lib/axios/api";

const COPY = {
  az: {
    choose: "Maşın seçin",
    brand: "Marka",
    model: "Model",
    forLabel: (label) => `${label} üçün`,
    confirm: "Səbətə at",
    loading: "Yüklənir...",
    emptyModels: "Bu marka üçün model yoxdur. Marka ilə davam edə bilərsiniz.",
    pickBrand: "Marka seçin",
    pickModel: "Model seçin",
    missing: "Maşın seçin",
    loadError: "Maşın siyahısı yüklənmədi",
    helper: "Bu məhsul üçün marka və model seçin",
  },
  en: {
    choose: "Choose a car",
    brand: "Brand",
    model: "Model",
    forLabel: (label) => `for ${label}`,
    confirm: "Add to cart",
    loading: "Loading...",
    emptyModels: "No models for this brand. You can continue with the brand.",
    pickBrand: "Select a brand",
    pickModel: "Select a model",
    missing: "Choose a car",
    loadError: "Could not load cars",
    helper: "Choose a brand and model for this product",
  },
  ru: {
    choose: "Выберите автомобиль",
    brand: "Марка",
    model: "Модель",
    forLabel: (label) => `для ${label}`,
    confirm: "В корзину",
    loading: "Загрузка...",
    emptyModels: "Для этой марки нет моделей. Можно продолжить с маркой.",
    pickBrand: "Выберите марку",
    pickModel: "Выберите модель",
    missing: "Выберите автомобиль",
    loadError: "Не удалось загрузить автомобили",
    helper: "Выберите марку и модель для этого товара",
  },
};

export function fitmentCopy(locale) {
  const lang = String(locale || "az").slice(0, 2);
  return COPY[lang] || COPY.az;
}

export function fitmentLabel(selection) {
  const brand = selection?.brand?.title;
  if (!brand) return "";
  const model = selection?.brand_model?.title;
  return model ? `${brand} ${model}` : brand;
}

export function itemFitment(item) {
  return item?.fitment_selection || item?.product?.fitment_selection || null;
}

export function basketLineKey(item) {
  const selection = itemFitment(item);
  const brandId = selection?.brand?.id ?? "";
  const modelId = selection?.brand_model?.id ?? "";
  const id = item?.uuid ?? item?.product?.uuid ?? item?.id ?? "";
  return `${id}-${brandId}-${modelId}`;
}

export function needsFitmentChoice(item) {
  const required =
    item?.requires_fitment_selection ?? item?.product?.requires_fitment_selection;
  return Boolean(required) && !itemFitment(item)?.brand;
}

function asList(body) {
  const data = body?.data ?? body;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.models)) return data.models;
  if (Array.isArray(data?.brands)) return data.brands;
  return [];
}

export async function fetchFitmentOptions(uuid) {
  const response = await api.get(`/products/show/${uuid}`);
  const data = response.data?.data ?? response.data;
  return data?.fitment_selection_options ?? null;
}

export async function fetchCarBrands() {
  const response = await api.get("/car-libraries/brands");
  return asList(response.data);
}

export async function fetchCarModels(brandId) {
  const response = await api.get(`/car-libraries/brands/${brandId}/models`);
  return asList(response.data);
}
