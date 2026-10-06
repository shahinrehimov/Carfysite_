"use client";

import { useLocale } from "next-intl";
import { fitmentCopy, fitmentLabel } from "@/lib/fitmentSelection";

export default function FitmentBadge({ selection, className = "" }) {
  const locale = useLocale();
  const label = fitmentLabel(selection);
  if (!label) return null;

  return (
    <span
      className={`mt-1 inline-flex w-fit items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ${className}`}
    >
      🚗 {fitmentCopy(locale).forLabel(label)}
    </span>
  );
}

export function FitmentMissingNotice({ onChoose, className = "" }) {
  const locale = useLocale();
  const copy = fitmentCopy(locale);

  return (
    <button
      type="button"
      onClick={onChoose}
      className={`mt-1 inline-flex w-fit items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 hover:bg-amber-100 ${className}`}
    >
      {copy.missing}
    </button>
  );
}
