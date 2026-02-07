"use client";

import { useTranslations } from "next-intl";
import { useDashboardSummary, useLineChart } from "@/lib/hooks/useDashboard";
import SavingsCard from "@/components/dashboard/SavingsCard";
import SavingsLineChart from "@/components/dashboard/SavingsLineChart";
import { DashboardSummary, LineChartPoint } from "@/types/dashboard";

// TODO: remove once auth is implemented
const MOCK_SUMMARY: DashboardSummary = {
  totalCurrentValue: 10458.32,
  totalInvested: 10000,
  gain: 458.32,
};

const MOCK_LINE_CHART: LineChartPoint[] = [
  { date: "2025-04-01", value: 0 },
  { date: "2025-04-08", value: 5000 },
  { date: "2025-04-15", value: 5120 },
  { date: "2025-04-22", value: 7500 },
  { date: "2025-04-29", value: 7680 },
  { date: "2025-05-06", value: 10000 },
  { date: "2025-05-13", value: 10250 },
  { date: "2025-05-20", value: 10180 },
  { date: "2025-05-27", value: 10458 },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: summary, isLoading: loadingSummary, error: errorSummary } = useDashboardSummary();
  const { data: lineChart, error: errorLineChart } = useLineChart();

  const displaySummary = summary ?? (errorSummary ? MOCK_SUMMARY : null);
  const displayLineChart = lineChart ?? (errorLineChart ? MOCK_LINE_CHART : null);

  return (
    <div className="space-y-8">
      <h1 className="font-title text-2xl font-bold text-foreground">
        {t("title")}
      </h1>

      {loadingSummary ? (
        <p className="text-foreground-muted">Chargement...</p>
      ) : displaySummary ? (
        <>
          <SavingsCard data={displaySummary} />
          {displayLineChart && <SavingsLineChart data={displayLineChart} />}
        </>
      ) : (
        <p className="text-foreground-muted">{t("noData")}</p>
      )}
    </div>
  );
}
