// src/lib/firebase/firestore.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Schedule, ScheduleInput } from "@/types/schedule";

const SCHEDULES_COLLECTION = "schedules";

// 週の予定を取得
export const getWeekSchedules = async (
  startDate: string,
  endDate: string
): Promise<Schedule[]> => {
  const q = query(
    collection(db, SCHEDULES_COLLECTION),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Schedule;
  });
};

// 予定を作成
export const createSchedule = async (
  userId: string,
  userEmail: string,
  userName: string,
  userPhotoURL: string,
  scheduleData: ScheduleInput
): Promise<string> => {
  const docRef = await addDoc(collection(db, SCHEDULES_COLLECTION), {
    userId,
    userEmail,
    userName,
    userPhotoURL,
    ...scheduleData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// 予定を更新
export const updateSchedule = async (
  scheduleId: string,
  scheduleData: Partial<ScheduleInput>
): Promise<void> => {
  const scheduleRef = doc(db, SCHEDULES_COLLECTION, scheduleId);
  await updateDoc(scheduleRef, {
    ...scheduleData,
    updatedAt: Timestamp.now(),
  });
};

// 予定を削除
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  const scheduleRef = doc(db, SCHEDULES_COLLECTION, scheduleId);
  await deleteDoc(scheduleRef);
};
