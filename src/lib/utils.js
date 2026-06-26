import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatAzPhoneForDisplay(phone) {
  if (!phone) return "";

  const digits = String(phone).replace(/\D/g, "");
  const normalized = digits.startsWith("994")
    ? digits
    : digits.startsWith("0")
      ? `994${digits.slice(1)}`
      : `994${digits}`;

  if (normalized.length >= 12) {
    const operator = normalized.slice(3, 5);
    const part1 = normalized.slice(5, 8);
    const part2 = normalized.slice(8, 10);
    const part3 = normalized.slice(10, 12);
    return `(0${operator}) ${part1} ${part2} ${part3}`;
  }

  return phone;
}
