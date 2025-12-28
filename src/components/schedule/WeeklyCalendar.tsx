// src/components/schedule/WeeklyCalendar.tsx
"use client";

import { Schedule } from "@/types/schedule";
import { User } from "@/types/user";
import { getWeekDates, formatDate, getDayLabel } from "@/lib/utils/dateUtils";
import {
  generateTimeSlots,
  timeToMinutes,
  calculateDuration,
} from "@/lib/utils/timeUtils";
import EventCard from "./EventCard";
import { deleteSchedule } from "@/lib/firebase/firestore";

interface WeeklyCalendarProps {
  currentDate: Date;
  schedules: Schedule[];
  user: User;
  onRefresh: () => void;
  onTimeSlotClick: (date: string, time: string) => void;
  onEditSchedule: (schedule: Schedule) => void;
}

export default function WeeklyCalendar({
  currentDate,
  schedules,
  user,
  onRefresh,
  onTimeSlotClick,
  onEditSchedule,
}: WeeklyCalendarProps) {
  const weekDates = getWeekDates(currentDate);
  const timeSlots = generateTimeSlots();

  // 表示する時間帯を8:00-20:00に制限（8時間→12時間に拡張）
  const displayTimeSlots = timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    return hour >= 8 && hour < 20;
  });

  const handleTimeSlotClick = (date: Date, time: string) => {
    console.log(
      "WeeklyCalendar: handleTimeSlotClick called",
      formatDate(date),
      time
    );
    onTimeSlotClick(formatDate(date), time);
  };

  const handleEditClick = (schedule: Schedule) => {
    onEditSchedule(schedule);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm("この予定を削除しますか?")) return;

    try {
      await deleteSchedule(scheduleId);
      onRefresh();
    } catch (error) {
      console.error("削除に失敗しました:", error);
      alert("削除に失敗しました");
    }
  };

  const getSchedulesForCell = (date: Date, time: string) => {
    const dateStr = formatDate(date);
    const timeMinutes = timeToMinutes(time);

    return schedules.filter((schedule) => {
      if (schedule.date !== dateStr) return false;
      const startMinutes = timeToMinutes(schedule.startTime);
      const endMinutes = timeToMinutes(schedule.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  };

  const calculateScheduleHeight = (schedule: Schedule) => {
    const duration = calculateDuration(schedule.startTime, schedule.endTime);
    const hours = duration / 60;
    return hours;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* スクロール可能なカレンダー */}
        <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-20">
                <tr>
                  <th className="sticky left-0 z-30 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20 border-r-2 border-gray-200">
                    時間
                  </th>
                  {weekDates.map((date) => (
                    <th
                      key={date.toISOString()}
                      className="px-3 py-3 text-center min-w-[160px]"
                    >
                      <div
                        className={`${
                          isToday(date)
                            ? "bg-blue-600 text-white rounded-lg py-2 px-2"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="text-base font-bold">
                          {date.getMonth() + 1}/{date.getDate()}
                        </div>
                        <div className="text-xs font-medium mt-0.5">
                          {getDayLabel(date)}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {displayTimeSlots.map((time) => (
                  <tr key={time} className="hover:bg-gray-50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white px-4 py-2 text-xs font-medium text-gray-600 border-r-2 border-gray-100">
                      <div className="text-center">{time}</div>
                    </td>
                    {weekDates.map((date) => {
                      const cellSchedules = getSchedulesForCell(date, time);
                      return (
                        <td
                          key={`${date.toISOString()}-${time}`}
                          className="px-2 py-2 border-l border-gray-100 hover:bg-blue-50 cursor-pointer transition-all relative"
                          style={{ height: "50px" }}
                          onClick={() => handleTimeSlotClick(date, time)}
                        >
                          <div className="relative w-full h-full pointer-events-none">
                            {cellSchedules.map((schedule) => {
                              const isFirstCell =
                                timeToMinutes(time) ===
                                timeToMinutes(schedule.startTime);
                              if (!isFirstCell) return null;

                              const heightInHours =
                                calculateScheduleHeight(schedule);

                              return (
                                <div
                                  key={schedule.id}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    height: `${heightInHours * 50 - 4}px`,
                                    minHeight: "46px",
                                  }}
                                  className="absolute left-0 right-0 pointer-events-auto"
                                >
                                  <EventCard
                                    schedule={schedule}
                                    isOwner={schedule.userId === user.uid}
                                    onEdit={() => handleEditClick(schedule)}
                                    onDelete={() =>
                                      handleDeleteSchedule(schedule.id)
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
