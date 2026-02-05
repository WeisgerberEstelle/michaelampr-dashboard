"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFunds } from "@/lib/hooks/useFunds";
import FundSelector from "@/components/deposit/FundSelector";

export default function DepositPage() {
  const t = useTranslations("deposit");
  const { data: funds, isLoading } = useFunds();
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);

  return (
    <div>
      <h1 className="font-title text-2xl font-bold text-foreground mb-6">
        {t("title")}
      </h1>

      {isLoading ? (
        <p className="text-foreground-muted">{t("loadingFunds")}</p>
      ) : funds ? (
        <FundSelector
          funds={funds}
          selectedIsins={selectedIsins}
          onChange={setSelectedIsins}
        />
      ) : null}
    </div>
  );
}
