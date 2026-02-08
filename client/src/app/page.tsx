"use client";

import { useTranslations } from "next-intl";
import { useDashboardSummary, useLineChart, usePieChart } from "@/lib/hooks/useDashboard";
import { useDeposits } from "@/lib/hooks/useDeposits";
import SavingsCard from "@/components/dashboard/SavingsCard";
import SavingsLineChart from "@/components/dashboard/SavingsLineChart";
import AllocationPieChart from "@/components/dashboard/AllocationPieChart";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: summary, isLoading: loadingSummary } = useDashboardSummary();
  const { data: lineChart } = useLineChart();
  const { data: pieChart } = usePieChart();
  const { data: deposits } = useDeposits();

  return (
    <div className="space-y-8">
      <h1 className="font-title text-2xl font-bold text-foreground">
        {t("title")}
      </h1>

      {loadingSummary ? (
        <p className="text-foreground-muted">Chargement...</p>
      ) : summary ? (
        <>
          <SavingsCard data={summary} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lineChart && <SavingsLineChart data={lineChart} />}
            {pieChart && <AllocationPieChart data={pieChart} />}
          </div>
          {deposits && <TransactionHistory deposits={deposits} />}
        </>
      ) : (
        <p className="text-foreground-muted">{t("noData")}</p>
      )}
    </div>
  );
}
