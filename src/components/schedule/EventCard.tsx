// src/components/schedule/EventCard.tsx
"use client";

import { Schedule } from "@/types/schedule";
import UserAvatar from "../common/UserAvatar";

interface EventCardProps {
  schedule: Schedule;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventCard({
  schedule,
  isOwner,
  onEdit,
  onDelete,
}: EventCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] relative group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="mt-0.5">
            <UserAvatar
              user={{
                photoURL: schedule.userPhotoURL,
                displayName: schedule.userName,
              }}
              size="sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{schedule.title}</p>
            <p className="text-xs opacity-90 flex items-center gap-1 mt-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {schedule.startTime} - {schedule.endTime}
            </p>
            <p className="text-xs opacity-75 mt-1">{schedule.userName}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="編集"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-white hover:bg-red-500 hover:bg-opacity-80 rounded transition-colors"
              title="削除"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
