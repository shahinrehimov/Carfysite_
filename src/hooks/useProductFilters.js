"use client";

import { useEffect, useState } from "react";
import {
  fetchProductFilters,
  getCachedProductFilters,
} from "@/lib/productFilters";

/**
 * Loads `/{provider}/products/filters` once (module cache); shares data across components.
 */
export function useProductFilters() {
  const [data, setData] = useState(() => getCachedProductFilters());
  const [loading, setLoading] = useState(() => !getCachedProductFilters());
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProductFilters()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
