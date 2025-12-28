// src/lib/utils/timeUtils.ts
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
};

export const isTimeValid = (startTime: string, endTime: string): boolean => {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
};
