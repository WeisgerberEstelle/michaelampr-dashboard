"use client";

import { useTranslations } from "next-intl";
import { useDashboardSummary } from "@/lib/hooks/useDashboard";
import SavingsCard from "@/components/dashboard/SavingsCard";
import { DashboardSummary } from "@/types/dashboard";

// TODO: remove once auth is implemented
const MOCK_SUMMARY: DashboardSummary = {
  totalCurrentValue: 10458.32,
  totalInvested: 10000,
  gain: 458.32,
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: summary, isLoading, error } = useDashboardSummary();

  const displayData = summary ?? (error ? MOCK_SUMMARY : null);

  return (
    <div className="space-y-8">
      <h1 className="font-title text-2xl font-bold text-foreground">
        {t("title")}
      </h1>

      {isLoading ? (
        <p className="text-foreground-muted">Chargement...</p>
      ) : displayData ? (
        <SavingsCard data={displayData} />
      ) : (
        <p className="text-foreground-muted">{t("noData")}</p>
      )}
    </div>
  );
}
