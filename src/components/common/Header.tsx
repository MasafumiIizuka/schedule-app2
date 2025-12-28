// src/components/common/Header.tsx
"use client";

import { signOut } from "@/lib/firebase/auth";
import { User } from "@/types/user";
import UserAvatar from "./UserAvatar";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-4xl">📆</span>
          スケジュール管理
        </h1>
        {user && (
          <div className="flex items-center gap-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
            <UserAvatar user={user} size="md" />
            <span className="text-sm font-medium text-white">
              {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
