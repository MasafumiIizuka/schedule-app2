// src/types/schedule.ts
export interface Schedule {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoURL: string;
  date: string; // YYYY-MM-DD形式
  startTime: string; // HH:mm形式
  endTime: string; // HH:mm形式
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleInput {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
}
