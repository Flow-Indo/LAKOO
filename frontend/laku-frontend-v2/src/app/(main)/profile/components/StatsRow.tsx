 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsRowProps {
  stats?: { redEnvelope?: number; vouchers?: number; points?: number; balance?: number };
}

const statItems = [
  { key: "redEnvelope", labelKey: "profile.stats.redEnvelope", route: "/wallet/red-envelope" },
  { key: "vouchers", labelKey: "profile.stats.vouchers", route: "/wallet/vouchers" },
  { key: "points", labelKey: "profile.stats.points", route: "/wallet/points" },
  { key: "balance", labelKey: "profile.stats.balance", route: "/wallet/balance" },
];

export default function StatsRow({ stats }: StatsRowProps) {
  const router = useRouter();
  const storedStats = stats ?? useAuthStore((s: any) => s.stats) ?? {};
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4 grid grid-cols-4 gap-2">
      {statItems.map((it) => {
        const value = storedStats[it.key] ?? 0;
        return (
          <button
            key={it.key}
            onClick={() => router.push(it.route)}
            className="flex flex-col items-center text-center p-2"
          >
            <div className="w-10 h-10 rounded-md bg-[#FFF4F4] flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[#dc2626]" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-[#dc2626]">{value}</div>
            <div className="text-xs text-gray-600 text-center">{t(it.labelKey)}</div>
          </button>
        );
      })}
    </div>
  );
}

