"use client";

import { Fund } from "@/types/fund";
import { useTranslations } from "next-intl";

export interface AllocationEntry {
  isin: string;
  percentage: number;
}

interface AllocationSliderProps {
  funds: Fund[];
  allocations: AllocationEntry[];
  onChange: (allocations: AllocationEntry[]) => void;
}

export default function AllocationSlider({
  funds,
  allocations,
  onChange,
}: AllocationSliderProps) {
  const t = useTranslations("allocationSlider");

  const total = allocations.reduce((sum, a) => sum + a.percentage, 0);

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
      <div className="space-y-2">
        {allocations.map((allocation) => {
          const fund = funds.find((f) => f.isin === allocation.isin);
          return (
            <div key={allocation.isin} className="flex items-center gap-3">
              <span className="text-sm text-foreground truncate flex-1">
                {fund?.fundName ?? allocation.isin}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={allocation.percentage}
                onChange={(e) => handleChange(allocation.isin, Number(e.target.value))}
                className="w-20 rounded border border-gray-200 px-2 py-1 text-sm text-right"
              />
              <span className="text-sm text-foreground-muted">%</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-foreground-muted">
        {t("total")} : {total}%
      </p>
    </fieldset>
  );
}
