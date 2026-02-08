"use client";

import { useTranslations } from "next-intl";
import { useDashboardSummary, useLineChart, usePieChart } from "@/lib/hooks/useDashboard";
import { useDeposits } from "@/lib/hooks/useDeposits";
import SavingsCard from "@/components/dashboard/SavingsCard";
import SavingsLineChart from "@/components/dashboard/SavingsLineChart";
import AllocationPieChart from "@/components/dashboard/AllocationPieChart";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { DashboardSummary, LineChartPoint, PieChartEntry } from "@/types/dashboard";
import { Deposit } from "@/types/deposit";

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

const MOCK_PIE_CHART: PieChartEntry[] = [
  { name: "Harmon Ltd Fund", value: 3500 },
  { name: "Sanchez-Curtis Fund", value: 2800 },
  { name: "Lopez, Alexander and Berger Fund", value: 2100 },
  { name: "Garrison-Medina Fund", value: 1200 },
  { name: "Martinez Group Fund", value: 858 },
];

const MOCK_DEPOSITS: Deposit[] = [
  {
    _id: "1",
    userId: "user1",
    amount: 5000,
    rib: "FR7630001007941234567890185",
    bic: "BNPAFRPP",
    date: "2025-04-15",
    createdAt: "2025-04-15T10:00:00Z",
    allocations: [
      { fundId: "f1", isin: "IT2841589903", fundName: "Harmon Ltd Fund", percentage: 40, amountInvested: 2000, sharePrice: 101.96, sharesAcquired: 19.6155 },
      { fundId: "f2", isin: "DE4255811497", fundName: "Sanchez-Curtis Fund", percentage: 35, amountInvested: 1750, sharePrice: 98.45, sharesAcquired: 17.7755 },
      { fundId: "f3", isin: "FR1967912075", fundName: "Lopez, Alexander and Berger Fund", percentage: 25, amountInvested: 1250, sharePrice: 105.20, sharesAcquired: 11.8821 },
    ],
  },
  {
    _id: "2",
    userId: "user1",
    amount: 5000,
    rib: "FR7630001007941234567890185",
    bic: "BNPAFRPP",
    date: "2025-05-01",
    createdAt: "2025-05-01T10:00:00Z",
    allocations: [
      { fundId: "f1", isin: "IT2841589903", fundName: "Harmon Ltd Fund", percentage: 30, amountInvested: 1500, sharePrice: 108.32, sharesAcquired: 13.8504 },
      { fundId: "f4", isin: "US7150475380", fundName: "Garrison-Medina Fund", percentage: 40, amountInvested: 2000, sharePrice: 112.50, sharesAcquired: 17.7778 },
      { fundId: "f5", isin: "ES8719508980", fundName: "Martinez Group Fund", percentage: 30, amountInvested: 1500, sharePrice: 95.80, sharesAcquired: 15.6576 },
    ],
  },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: summary, isLoading: loadingSummary, error: errorSummary } = useDashboardSummary();
  const { data: lineChart, error: errorLineChart } = useLineChart();
  const { data: pieChart, error: errorPieChart } = usePieChart();
  const { data: deposits, error: errorDeposits } = useDeposits();

  const displaySummary = summary ?? (errorSummary ? MOCK_SUMMARY : null);
  const displayLineChart = lineChart ?? (errorLineChart ? MOCK_LINE_CHART : null);
  const displayPieChart = pieChart ?? (errorPieChart ? MOCK_PIE_CHART : null);
  const displayDeposits = deposits ?? (errorDeposits ? MOCK_DEPOSITS : null);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayLineChart && <SavingsLineChart data={displayLineChart} />}
            {displayPieChart && <AllocationPieChart data={displayPieChart} />}
          </div>
          {displayDeposits && <TransactionHistory deposits={displayDeposits} />}
        </>
      ) : (
        <p className="text-foreground-muted">{t("noData")}</p>
      )}
    </div>
  );
}
