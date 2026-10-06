"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchCarBrands,
  fetchCarModels,
  fetchFitmentOptions,
  fitmentCopy,
} from "@/lib/fitmentSelection";

function brandAnyModel(brand, anyBrand) {
  if (anyBrand) return true;
  return Boolean(brand?.any_model);
}

export default function FitmentSelectionModal({
  open,
  onOpenChange,
  productUuid,
  options,
  pending = false,
  onConfirm,
}) {
  const locale = useLocale();
  const copy = fitmentCopy(locale);
  const [resolvedOptions, setResolvedOptions] = useState(options ?? null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setSelectedBrandId("");
    setSelectedModelId("");
    setModels([]);
    setLoadError("");

    const load = async () => {
      setLoadingOptions(true);
      try {
        const nextOptions = options ?? (await fetchFitmentOptions(productUuid));
        if (cancelled) return;
        setResolvedOptions(nextOptions);

        if (nextOptions?.any_brand) {
          const libraryBrands = await fetchCarBrands();
          if (!cancelled) setBrands(libraryBrands);
        } else {
          setBrands(nextOptions?.brands ?? []);
        }
      } catch {
        if (!cancelled) {
          setResolvedOptions(null);
          setBrands([]);
          setLoadError(copy.loadError);
        }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // copy.loadError is derived from locale and must not retrigger this fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, productUuid, options, locale]);

  useEffect(() => {
    if (!open || brands.length !== 1) return;
    setSelectedBrandId(String(brands[0].id));
  }, [open, brands]);

  const selectedBrand =
    brands.find((brand) => String(brand.id) === String(selectedBrandId)) ?? null;
  const anyModel = brandAnyModel(selectedBrand, resolvedOptions?.any_brand);

  useEffect(() => {
    if (!open || !selectedBrand) {
      setModels([]);
      return;
    }

    let cancelled = false;
    setSelectedModelId("");
    setModels([]);

    const loadModels = async () => {
      setModelsLoading(true);
      try {
        const nextModels = anyModel
          ? await fetchCarModels(selectedBrand.id)
          : selectedBrand.models ?? [];
        if (cancelled) return;
        setModels(nextModels);
        if (nextModels.length === 1) {
          setSelectedModelId(String(nextModels[0].id));
        }
      } catch {
        if (!cancelled) setModels([]);
      } finally {
        if (!cancelled) setModelsLoading(false);
      }
    };

    loadModels();
    return () => {
      cancelled = true;
    };
  }, [open, selectedBrand, anyModel]);

  const modelsOptional = anyModel && !modelsLoading && models.length === 0;
  const canConfirm =
    Boolean(selectedBrandId) && (Boolean(selectedModelId) || modelsOptional) && !pending;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await onConfirm({
      brand_id: Number(selectedBrandId),
      ...(selectedModelId ? { brand_model_id: Number(selectedModelId) } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.choose}</DialogTitle>
          <DialogDescription>{copy.helper}</DialogDescription>
        </DialogHeader>

        {loadingOptions ? (
          <p className="text-sm text-gray-500">{copy.loading}</p>
        ) : loadError ? (
          <p className="text-sm text-red-600">{loadError}</p>
        ) : (
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-gray-700">{copy.brand}</span>
              <select
                value={selectedBrandId}
                onChange={(event) => setSelectedBrandId(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="">{copy.pickBrand}</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-gray-700">{copy.model}</span>
              <select
                value={selectedModelId}
                onChange={(event) => setSelectedModelId(event.target.value)}
                disabled={!selectedBrandId || modelsLoading || modelsOptional}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-50"
              >
                <option value="">
                  {modelsLoading ? copy.loading : copy.pickModel}
                </option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.title}
                  </option>
                ))}
              </select>
              {modelsOptional && (
                <p className="text-xs text-gray-500">{copy.emptyModels}</p>
              )}
            </label>
          </div>
        )}

        <DialogFooter>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || loadingOptions}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#00569C] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? copy.loading : copy.confirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
