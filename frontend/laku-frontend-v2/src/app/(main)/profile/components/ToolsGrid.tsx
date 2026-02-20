 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const tools = [
  { key: "favorites", labelKey: "profile.tools.favorites", route: "/favorites", gradientFrom: "#ffd6d6", gradientTo: "#ffc1c1" },
  { key: "followed", labelKey: "profile.tools.followed", route: "/stores", gradientFrom: "#fff0d6", gradientTo: "#ffd7b5" },
  { key: "history", labelKey: "profile.tools.history", route: "/history", gradientFrom: "#dfeaff", gradientTo: "#cfe7ff" },
  { key: "help", labelKey: "profile.tools.help", route: "/support", gradientFrom: "#f5d6ff", gradientTo: "#e8bfff" },
  { key: "payments", labelKey: "profile.tools.payments", route: "/payment-methods", gradientFrom: "#d9f7e6", gradientTo: "#bff0d1" },
  { key: "addresses", labelKey: "profile.tools.addresses", route: "/address", gradientFrom: "#fff2f0", gradientTo: "#ffdede" },
  { key: "messages", labelKey: "profile.tools.notifications", route: "/messages", gradientFrom: "#f1f0ff", gradientTo: "#e3ddff" },
  { key: "vouchers", labelKey: "profile.tools.vouchers", route: "/wallet/vouchers", gradientFrom: "#fff6d6", gradientTo: "#fff0b5" },
  { key: "referral", labelKey: "profile.tools.referral", route: "/referral", gradientFrom: "#ffe6f0", gradientTo: "#ffcfe0" },
  { key: "security", labelKey: "profile.tools.security", route: "/security", gradientFrom: "#e6f7ff", gradientTo: "#cfeeff" },
];

export default function ToolsGrid() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4">
      <div className="grid grid-cols-5 gap-3">
        {tools.map((tItem) => (
          <button
            key={tItem.key}
            onClick={() => router.push(tItem.route)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${tItem.gradientFrom} 0%, ${tItem.gradientTo} 100%)` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-xs text-center leading-tight">{t(tItem.labelKey)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

