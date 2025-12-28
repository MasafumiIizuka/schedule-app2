// src/app/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSchedule } from "@/lib/hooks/useSchedule";
import { getWeekRange, addWeeks } from "@/lib/utils/dateUtils";
import Header from "@/components/common/Header";
import WeekNavigator from "@/components/schedule/WeekNavigator";
import WeeklyCalendar from "@/components/schedule/WeeklyCalendar";
import EventModal from "@/components/schedule/EventModal";

export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const weekRange = getWeekRange(currentDate);
  const {
    schedules,
    loading: scheduleLoading,
    refetch,
  } = useSchedule(weekRange.start, weekRange.end);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handlePrevWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (date: string, time: string) => {
    console.log("Time slot clicked:", date, time);
    setSelectedDate(date);
    setSelectedTime(time);
    setEditingSchedule(null);
    setIsPanelOpen(true);
  };

  const handleEditSchedule = (schedule: any) => {
    console.log("Edit schedule:", schedule);
    setSelectedDate(schedule.date);
    setEditingSchedule(schedule);
    setIsPanelOpen(true);
  };

  const handleSaveSchedule = async (data: any) => {
    const { createSchedule, updateSchedule } = await import(
      "@/lib/firebase/firestore"
    );

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, data);
      } else {
        await createSchedule(
          user!.uid,
          user!.email || "",
          user!.displayName || "Unknown",
          user!.photoURL || "",
          data
        );
      }
      refetch();
      setIsPanelOpen(false);
    } catch (error) {
      console.error("保存に失敗しました:", error);
      throw error;
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setEditingSchedule(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user} />
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WeekNavigator
          currentDate={currentDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />

        {scheduleLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600 font-medium">
                スケジュールを読み込んでいます...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* カレンダー部分 */}
            <div className="flex-1">
              <WeeklyCalendar
                currentDate={currentDate}
                schedules={schedules}
                user={user}
                onRefresh={refetch}
                onTimeSlotClick={handleTimeSlotClick}
                onEditSchedule={handleEditSchedule}
              />
            </div>

            {/* 右側の入力パネル - 常時表示 */}
            <div className="w-[30%] min-w-[350px] flex-shrink-0 sticky top-8 h-fit">
              {isPanelOpen ? (
                <EventModal
                  isOpen={isPanelOpen}
                  onClose={handleClosePanel}
                  onSave={handleSaveSchedule}
                  initialData={editingSchedule}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12">
                  <div className="text-center text-gray-400">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 mb-2">
                      予定を追加
                    </p>
                    <p className="text-sm text-gray-500">
                      カレンダーのセルをクリックして
                      <br />
                      予定を追加してください
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
