// src/lib/utils/dateUtils.ts
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getWeekDates = (baseDate: Date): Date[] => {
  const dates: Date[] = [];
  const day = baseDate.getDay();
  const diff = baseDate.getDate() - day; // 日曜日を週の始まりとする

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(diff + i);
    dates.push(date);
  }
  return dates;
};

export const getWeekRange = (
  baseDate: Date
): { start: string; end: string } => {
  const dates = getWeekDates(baseDate);
  return {
    start: formatDate(dates[0]),
    end: formatDate(dates[6]),
  };
};

export const addWeeks = (date: Date, weeks: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + weeks * 7);
  return newDate;
};

export const getDayLabel = (date: Date): string => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[date.getDay()];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};
