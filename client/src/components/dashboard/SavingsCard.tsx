"use client";

import { useTranslations } from "next-intl";
import { DashboardSummary } from "@/types/dashboard";

interface SavingsCardProps {
  data: DashboardSummary;
}

export default function SavingsCard({ data }: SavingsCardProps) {
  const t = useTranslations("dashboard");

  const { totalCurrentValue, totalInvested, gain } = data;
  const isPositive = gain >= 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-surface rounded-xl p-5 shadow-sm">
        <p className="text-sm text-foreground-muted mb-1">{t("totalSavings")}</p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(totalCurrentValue)}
        </p>
      </div>

      <div className="bg-surface rounded-xl p-5 shadow-sm">
        <p className="text-sm text-foreground-muted mb-1">{t("totalInvested")}</p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(totalInvested)}
        </p>
      </div>

      <div className="bg-surface rounded-xl p-5 shadow-sm">
        <p className="text-sm text-foreground-muted mb-1">
          {isPositive ? t("gain") : t("loss")}
        </p>
        <p
          className={`text-2xl font-bold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(gain)}
        </p>
      </div>
    </div>
  );
}
