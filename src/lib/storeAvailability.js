/**
 * Store availability helpers for seller.working_hours / seller.availability.
 * seller may be null (e.g. basket set items) — never treat unknown sellers as closed.
 */

/** @returns {boolean} */
export function isSellerClosed(seller) {
  return seller?.availability?.is_open === false;
}

/** ISO-8601 day of week: 1 = Monday, 7 = Sunday */
export function getTodayIsoDayOfWeek() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * @param {number} dayOfWeek 1–7 (ISO)
 * @param {(key: string) => string} t
 */
export function getWeekdayName(dayOfWeek, t) {
  return t(`weekday_${dayOfWeek}`);
}

/**
 * Format a single working hours row.
 * @param {{ day_of_week: number, is_closed: boolean, open_time: string | null, close_time: string | null }} row
 * @param {(key: string, values?: Record<string, string>) => string} t
 */
export function formatWorkingHourRow(row, t) {
  const day = getWeekdayName(row.day_of_week, t);
  if (row.is_closed) {
    return { day, hours: t("working_hours_closed") };
  }
  if (row.open_time && row.close_time) {
    return { day, hours: `${row.open_time} – ${row.close_time}` };
  }
  return { day, hours: "—" };
}
