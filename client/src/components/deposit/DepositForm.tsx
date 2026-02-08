"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FundWithLatestVL } from "@/types/fund";
import api from "@/lib/api";
import FundSelector from "./FundSelector";
import AllocationInputs, { AllocationEntry } from "./AllocationInputs";

const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;
const BIC_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

interface DepositFormProps {
  funds: FundWithLatestVL[];
}

interface FieldErrors {
  amount?: string;
  rib?: string;
  bic?: string;
  date?: string;
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getErrors = (values: { amount: string; rib: string; bic: string; date: string }): FieldErrors => {
    const errors: FieldErrors = {};
    if (values.amount !== "" && Number(values.amount) <= 0)
      errors.amount = t("errorAmountPositive");
    if (touched.rib && values.rib !== "" && !IBAN_REGEX.test(values.rib.replace(/\s/g, "").toUpperCase()))
      errors.rib = t("errorIbanFormat");
    if (touched.bic && values.bic !== "" && !BIC_REGEX.test(values.bic.replace(/\s/g, "").toUpperCase()))
      errors.bic = t("errorBicFormat");
    if (touched.date && values.date === "") errors.date = t("errorDateRequired");
    return errors;
  };

  const fieldErrors = getErrors({ amount, rib, bic, date });

  const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const isValid =
    Number(amount) > 0 &&
    IBAN_REGEX.test(rib.replace(/\s/g, "").toUpperCase()) &&
    BIC_REGEX.test(bic.replace(/\s/g, "").toUpperCase()) &&
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/deposits", {
        amount: Number(amount),
        rib: rib.replace(/\s/g, "").toUpperCase(),
        bic: bic.replace(/\s/g, "").toUpperCase(),
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

  const baseInputClassName =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1";

  const inputClassName = (field: keyof FieldErrors) =>
    `${baseInputClassName} ${
      fieldErrors[field]
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : "border-gray-200 focus:border-primary focus:ring-primary"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
            {t("amount")}
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                setAmount(val);
              }
            }}
            placeholder={t("amountPlaceholder")}
            className={inputClassName("amount")}
          />
          {fieldErrors.amount && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.amount}</p>
          )}
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
            className={inputClassName("date")}
          />
          {fieldErrors.date && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.date}</p>
          )}
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
            onBlur={() => setTouched((prev) => ({ ...prev, rib: true }))}
            placeholder={t("ribPlaceholder")}
            className={inputClassName("rib")}
          />
          {fieldErrors.rib && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.rib}</p>
          )}
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
            onBlur={() => setTouched((prev) => ({ ...prev, bic: true }))}
            placeholder={t("bicPlaceholder")}
            className={inputClassName("bic")}
          />
          {fieldErrors.bic && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.bic}</p>
          )}
        </div>
      </div>

      <FundSelector
        funds={funds}
        selectedIsins={selectedIsins}
        onChange={handleSelectionChange}
      />

      {selectedIsins.length > 0 && (
        <AllocationInputs
          funds={funds}
          allocations={allocations}
          onChange={setAllocations}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

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
