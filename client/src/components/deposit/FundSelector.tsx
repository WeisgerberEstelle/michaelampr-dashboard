"use client";

import { FundWithLatestVL } from "@/types/fund";
import { useTranslations } from "next-intl";

interface FundSelectorProps {
  funds: FundWithLatestVL[];
  selectedIsins: string[];
  onChange: (selectedIsins: string[]) => void;
}

export default function FundSelector({
  funds,
  selectedIsins,
  onChange,
}: FundSelectorProps) {
  const t = useTranslations("fundSelector");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const toggleFund = (isin: string) => {
    if (selectedIsins.includes(isin)) {
      onChange(selectedIsins.filter((s) => s !== isin));
    } else {
      onChange([...selectedIsins, isin]);
    }
  };

  return (
    <fieldset>
      <legend className="font-title text-sm font-semibold text-foreground mb-3">
        {t("legend")}
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {funds.map((fund) => {
          const isSelected = selectedIsins.includes(fund.isin);
          return (
            <label
              key={fund.isin}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/40"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleFund(fund.isin)}
                className="accent-primary w-4 h-4 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {fund.fundName}
                </p>
                <p className="text-xs text-foreground-muted">{fund.isin}</p>
              </div>
              {fund.latestValorisation && (
                <span className="text-sm font-semibold text-primary shrink-0">
                  {formatCurrency(fund.latestValorisation.value)}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
