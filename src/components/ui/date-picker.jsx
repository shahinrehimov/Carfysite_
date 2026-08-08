"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDisplayDate(value) {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD.MM.YYYY") : "";
}

export function DatePicker({
  value = "",
  onChange,
  placeholder,
  className,
  triggerClassName,
  disabled = false,
  minDate,
  maxDate,
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (nextValue) => {
    setSelected(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-full border border-gray-200 bg-white min-h-[52px] px-5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00569C] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-60",
            selected ? "text-gray-900" : "text-gray-400",
            triggerClassName,
            className
          )}
        >
          <span>{selected ? formatDisplayDate(selected) : placeholder}</span>
          <CalendarIcon size={18} className="shrink-0 text-[#00569C]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={selected}
          onSelect={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}
