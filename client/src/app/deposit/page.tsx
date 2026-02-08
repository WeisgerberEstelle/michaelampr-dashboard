"use client";

import { useTranslations } from "next-intl";
import { useFundsLatestVL } from "@/lib/hooks/useFunds";
import DepositForm from "@/components/deposit/DepositForm";

export default function DepositPage() {
  const t = useTranslations("deposit");
  const { data: funds, isLoading } = useFundsLatestVL();

  return (
    <div>
      <h1 className="font-title text-2xl font-bold text-foreground mb-6">
        {t("title")}
      </h1>

      {isLoading ? (
        <p className="text-foreground-muted">{t("loadingFunds")}</p>
      ) : funds ? (
        <DepositForm funds={funds} />
      ) : null}
    </div>
  );
}
