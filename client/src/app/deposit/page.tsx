"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFunds } from "@/lib/hooks/useFunds";
import FundSelector from "@/components/deposit/FundSelector";
import AllocationSlider, {
  AllocationEntry,
} from "@/components/deposit/AllocationSlider";

export default function DepositPage() {
  const t = useTranslations("deposit");
  const { data: funds, isLoading } = useFunds();
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<AllocationEntry[]>([]);

  const handleSelectionChange = (isins: string[]) => {
    setSelectedIsins(isins);
    setAllocations(
      isins.map((isin) => ({
        isin,
        percentage: allocations.find((a) => a.isin === isin)?.percentage ?? 0,
      }))
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="font-title text-2xl font-bold text-foreground">
        {t("title")}
      </h1>

      {isLoading ? (
        <p className="text-foreground-muted">{t("loadingFunds")}</p>
      ) : funds ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}
