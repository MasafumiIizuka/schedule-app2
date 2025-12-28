// src/components/common/UserAvatar.tsx
import { User } from "@/types/user";
import Image from "next/image";

interface UserAvatarProps {
  user: User | { photoURL: string | null; displayName: string | null };
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export default function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  if (user.photoURL) {
    return (
      <Image
        src={user.photoURL}
        alt={user.displayName || "ユーザー"}
        width={size === "sm" ? 24 : size === "md" ? 32 : 40}
        height={size === "sm" ? 24 : size === "md" ? 32 : 40}
        className={`${sizeClasses[size]} rounded-full`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium`}
    >
      {user.displayName?.[0]?.toUpperCase() || "?"}
    </div>
  );
}
