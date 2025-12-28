// src/components/schedule/EventModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Schedule, ScheduleInput } from "@/types/schedule";
import { generateTimeSlots, isTimeValid } from "@/lib/utils/timeUtils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleInput) => Promise<void>;
  initialData?: Schedule | null;
  selectedDate: string;
  selectedTime?: string;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  selectedDate,
  selectedTime = "09:00",
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(selectedTime);
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setStartTime(selectedTime);
      setEndTime("10:00");
      setDescription("");
    }
    setError("");
  }, [initialData, selectedTime, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    if (!isTimeValid(startTime, endTime)) {
      setError("終了時刻は開始時刻より後にしてください");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        date: selectedDate,
        startTime,
        endTime,
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError("保存に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const dayName = dayNames[date.getDay()];
    return `${month}月${day}日(${dayName})`;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {initialData ? "📝 予定を編集" : "✨ 新しい予定"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-2">
          📅 {formatSelectedDate(selectedDate)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📌 タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            placeholder="会議、打ち合わせなど"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🕐 開始
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🕐 終了
            </label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📄 説明（任意）
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-base"
            rows={4}
            placeholder="詳細情報やメモ"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "保存中..." : "💾 保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
