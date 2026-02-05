"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Fund } from "@/types/fund";
import api from "@/lib/api";
import FundSelector from "./FundSelector";
import AllocationSlider, { AllocationEntry } from "./AllocationSlider";

interface DepositFormProps {
  funds: Fund[];
}

export default function DepositForm({ funds }: DepositFormProps) {
  const t = useTranslations("deposit");
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [rib, setRib] = useState("");
  const [bic, setBic] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<AllocationEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const isValid =
    Number(amount) > 0 &&
    rib.trim() !== "" &&
    bic.trim() !== "" &&
    date !== "" &&
    allocations.length > 0 &&
    total === 100;

  const handleSelectionChange = (isins: string[]) => {
    setSelectedIsins(isins);
    setAllocations(
      isins.map((isin) => ({
        isin,
        percentage: allocations.find((a) => a.isin === isin)?.percentage ?? 0,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/deposits", {
        amount: Number(amount),
        rib,
        bic,
        date,
        allocations: allocations.map(({ isin, percentage }) => ({
          isin,
          percentage,
        })),
      });
      router.push("/");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
            {t("amount")}
          </label>
          <input
            id="amount"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("amountPlaceholder")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">
            {t("date")}
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="rib" className="block text-sm font-medium text-foreground mb-1">
            {t("rib")}
          </label>
          <input
            id="rib"
            type="text"
            value={rib}
            onChange={(e) => setRib(e.target.value)}
            placeholder={t("ribPlaceholder")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="bic" className="block text-sm font-medium text-foreground mb-1">
            {t("bic")}
          </label>
          <input
            id="bic"
            type="text"
            value={bic}
            onChange={(e) => setBic(e.target.value)}
            placeholder={t("bicPlaceholder")}
            className={inputClassName}
          />
        </div>
      </div>

      <FundSelector
        funds={funds}
        selectedIsins={selectedIsins}
        onChange={handleSelectionChange}
      />

      {selectedIsins.length > 0 && (
        <AllocationSlider
          funds={funds}
          allocations={allocations}
          onChange={setAllocations}
        />
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
