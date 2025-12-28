// src/components/schedule/WeekNavigator.tsx
"use client";

interface WeekNavigatorProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export default function WeekNavigator({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}: WeekNavigatorProps) {
  const formatWeekRange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年${month}月`;
  };

  return (
    <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        📅 {formatWeekRange(currentDate)}
      </h2>
      <div className="flex gap-3">
        <button
          onClick={onToday}
          className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          今週
        </button>
        <button
          onClick={onPrevWeek}
          className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow font-medium"
        >
          ← 前週
        </button>
        <button
          onClick={onNextWeek}
          className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow font-medium"
        >
          次週 →
        </button>
      </div>
    </div>
  );
}
