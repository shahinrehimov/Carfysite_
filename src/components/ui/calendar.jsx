"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/az";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import updateLocale from "dayjs/plugin/updateLocale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

dayjs.extend(updateLocale);

const SUPPORTED_LOCALES = ["az", "en", "ru"];
for (const locale of SUPPORTED_LOCALES) {
  dayjs.updateLocale(locale, { weekStart: 1 });
}

function buildWeekdayLabels(locale) {
  const start = dayjs().locale(locale).startOf("week");
  return Array.from({ length: 7 }, (_, index) =>
    start.add(index, "day").format("dd")
  );
}

function buildYearOptions(minYear, maxYear) {
  const years = [];
  for (let year = maxYear; year >= minYear; year -= 1) {
    years.push(year);
  }
  return years;
}

function buildMonthOptions(locale) {
  return Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: dayjs().month(index).locale(locale).format("MMMM"),
  }));
}

export function Calendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  locale = "az",
  className,
}) {
  const min = minDate ? dayjs(minDate) : dayjs("1900-01-01");
  const max = maxDate ? dayjs(maxDate) : dayjs();

  const initialMonth = selected ? dayjs(selected) : max;
  const [viewMonth, setViewMonth] = useState(() =>
    initialMonth.startOf("month")
  );

  const years = useMemo(
    () => buildYearOptions(min.year(), max.year()),
    [min, max]
  );
  const months = useMemo(() => buildMonthOptions(locale), [locale]);
  const weekdays = useMemo(() => buildWeekdayLabels(locale), [locale]);

  const calendarDays = useMemo(() => {
    const start = viewMonth.startOf("month").startOf("week");
    const end = viewMonth.endOf("month").endOf("week");
    const days = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  }, [viewMonth]);

  const handleMonthChange = (month) => {
    setViewMonth((prev) => {
      const next = prev.month(Number(month));
      if (next.isBefore(min, "month")) return min.startOf("month");
      if (next.isAfter(max, "month")) return max.startOf("month");
      return next;
    });
  };

  const handleYearChange = (year) => {
    setViewMonth((prev) => {
      const next = prev.year(Number(year));
      if (next.isBefore(min, "month")) return min.startOf("month");
      if (next.isAfter(max, "month")) return max.startOf("month");
      return next;
    });
  };

  const isDisabled = (date) =>
    date.isBefore(min, "day") || date.isAfter(max, "day");

  return (
    <div className={cn("p-3 w-[280px]", className)}>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewMonth((prev) => prev.subtract(1, "month"))}
          disabled={viewMonth.subtract(1, "month").isBefore(min, "month")}
          className="inline-flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex flex-1 items-center gap-2">
          <select
            value={viewMonth.month()}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00569C]"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={viewMonth.year()}
            onChange={(e) => handleYearChange(e.target.value)}
            className="h-9 w-[88px] rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00569C]"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setViewMonth((prev) => prev.add(1, "month"))}
          disabled={viewMonth.add(1, "month").isAfter(max, "month")}
          className="inline-flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="py-1 text-center text-[11px] font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const inCurrentMonth = date.month() === viewMonth.month();
          const selectedDate = selected ? dayjs(selected) : null;
          const isSelected = selectedDate?.isSame(date, "day");
          const isToday = date.isSame(dayjs(), "day");
          const disabled = isDisabled(date);

          return (
            <button
              key={date.format("YYYY-MM-DD")}
              type="button"
              disabled={disabled}
              onClick={() => onSelect?.(date.format("YYYY-MM-DD"))}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                !inCurrentMonth && "text-gray-300",
                inCurrentMonth && !isSelected && "text-gray-700 hover:bg-[#E8F1FC]",
                isToday && !isSelected && "border border-[#00569C]/30",
                isSelected && "bg-[#00569C] text-white hover:bg-[#004580]",
                disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
              )}
            >
              {date.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
