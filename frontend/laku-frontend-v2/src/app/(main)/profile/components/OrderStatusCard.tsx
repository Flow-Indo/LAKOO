 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, Box, MessageSquare, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  counts?: Record<string, number>;
}

const statuses = [
  { key: "toPay", labelKey: "profile.order.toPay", route: "/orders?status=toPay", Icon: CreditCard, bg: "bg-[#FDE8E6]" },
  { key: "toShip", labelKey: "profile.order.toShip", route: "/orders?status=toShip", Icon: Truck, bg: "bg-[#EEF8FF]" },
  { key: "toReceive", labelKey: "profile.order.toReceive", route: "/orders?status=toReceive", Icon: Box, bg: "bg-[#FFF7EB]" },
  { key: "toReview", labelKey: "profile.order.toReview", route: "/orders?status=toReview", Icon: MessageSquare, bg: "bg-[#F3FDF0]" },
  { key: "refunds", labelKey: "profile.order.refunds", route: "/orders?status=refund", Icon: RefreshCcw, bg: "bg-[#F5F5F7]" },
];

export default function OrderStatusCard({ counts = {} }: Props) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-[#dc2626]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold">{t("profile.orders.title")}</h3>
        </div>
        <button onClick={() => router.push("/orders")} className="text-xs text-gray-500">
          {t("profile.orders.viewAll")}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {statuses.map((s) => {
          const Count = counts?.[s.key] ?? 0;
          return (
            <button
              key={s.key}
              onClick={() => router.push(s.route)}
              className="flex flex-col items-center p-2 relative"
            >
              <div className={`${s.bg} w-10 h-10 rounded-full flex items-center justify-center mb-1`}>
                <s.Icon className="w-5 h-5 text-[#dc2626]" />
              </div>
              <div className="text-xs text-center">{t(s.labelKey)}</div>
              {Count > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs text-white bg-[#dc2626] rounded-full">
                  {Count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

