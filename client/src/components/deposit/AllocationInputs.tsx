"use client";

import { FundWithLatestVL } from "@/types/fund";
import { useTranslations } from "next-intl";

export interface AllocationEntry {
  isin: string;
  percentage: number;
}

interface AllocationInputsProps {
  funds: FundWithLatestVL[];
  allocations: AllocationEntry[];
  onChange: (allocations: AllocationEntry[]) => void;
}

export default function AllocationInputs({
  funds,
  allocations,
  onChange,
}: AllocationInputsProps) {
  const t = useTranslations("allocationSlider");

  const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const isValid = total === 100;

  const handleChange = (isin: string, value: number) => {
    onChange(
      allocations.map((a) => (a.isin === isin ? { ...a, percentage: value } : a))
    );
  };

  return (
    <fieldset>
      <legend className="font-title text-sm font-semibold text-foreground mb-3">
        {t("legend")}
      </legend>
      <div className="space-y-3">
        {allocations.map((allocation) => {
          const fund = funds.find((f) => f.isin === allocation.isin);
          return (
            <div
              key={allocation.isin}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-200 bg-surface"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {fund?.fundName ?? allocation.isin}
                </p>
                <p className="text-xs text-foreground-muted">{allocation.isin}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={allocation.percentage}
                  onChange={(e) =>
                    handleChange(allocation.isin, Number(e.target.value))
                  }
                  className="w-16 rounded-lg border border-gray-200 bg-background px-2 py-1.5 text-sm text-right font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground-muted">%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-4 flex items-center justify-between p-3 rounded-lg border ${
          isValid
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        <span className="text-sm font-medium">
          {t("total")} : {total}%
        </span>
        {!isValid && <span className="text-xs">{t("errorTotal")}</span>}
      </div>
    </fieldset>
  );
}
