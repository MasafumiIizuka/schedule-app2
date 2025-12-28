// src/lib/hooks/useSchedule.ts
"use client";

import { useEffect, useState } from "react";
import { Schedule } from "@/types/schedule";
import { getWeekSchedules } from "@/lib/firebase/firestore";

export const useSchedule = (startDate: string, endDate: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeekSchedules(startDate, endDate);
      setSchedules(data);
    } catch (err) {
      setError("スケジュールの取得に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [startDate, endDate]);

  return { schedules, loading, error, refetch: fetchSchedules };
};
