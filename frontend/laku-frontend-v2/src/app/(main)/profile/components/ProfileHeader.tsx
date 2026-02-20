 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  user?: { name?: string; avatarUrl?: string; membership?: string };
  onEdit?: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const router = useRouter();
  const authUser = user ?? useAuthStore((s: any) => s.user);
  const displayName = authUser?.name ?? "Guest";
  const avatar = authUser?.avatarUrl ?? "/file.svg";
  const { t } = useLanguage();

  return (
    <header
      className="bg-gradient-to-br from-red-500 to-orange-400 p-6 rounded-b-2xl text-white relative"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-screen-sm mx-auto px-4">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full border-4 border-white overflow-hidden"
            onClick={() => (onEdit ? onEdit() : router.push("/profile/edit"))}
            role="button"
          >
            <img src={avatar} alt={t("profile.avatarAlt")} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white mb-1">{displayName}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">{t("profile.membership")}</span>
              <span className="text-xs text-white/90">ID: {authUser?.id ?? "-"}</span>
            </div>
            <p className="text-xs opacity-90 mt-2">
              {t("profile.savings")} <span className="font-semibold">¥3903</span>
            </p>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-3">
          <button onClick={() => router.push("/address")} className="p-2 rounded-full bg-white/10">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => router.push("/support")} className="p-2 rounded-full bg-white/10">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => router.push("/settings")} className="p-2 rounded-full bg-white/10">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.28 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.6 0 1.12-.36 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 4.7A2 2 0 0 1 7.13 2.87l.06.06a1.65 1.65 0 0 0 1.82.33h.09c.6 0 1.12-.36 1.51-1H13a2 2 0 0 1 4 0v.09c.39.64.91 1 1.51 1h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 0 1 21.72 6.1l-.06.06a1.65 1.65 0 0 0-.33 1.82c.39.64.91 1 1.51 1H21a2 2 0 0 1 0 4h-.09c-.6 0-1.12.36-1.51 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

