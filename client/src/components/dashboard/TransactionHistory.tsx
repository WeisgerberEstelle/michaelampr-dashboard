"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Deposit } from "@/types/deposit";

interface TransactionHistoryProps {
  deposits: Deposit[];
}

export default function TransactionHistory({ deposits }: TransactionHistoryProps) {
  const t = useTranslations("dashboard");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-surface rounded-xl p-5 shadow-sm">
      <h2 className="font-title text-lg font-semibold text-foreground mb-4">
        {t("historyTitle")}
      </h2>

      {deposits.length === 0 ? (
        <p className="text-foreground-muted text-sm">{t("noTransactions")}</p>
      ) : (
        <div className="space-y-3">
          {deposits.map((deposit) => (
            <div key={deposit._id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(deposit._id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(deposit.date)}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {deposit.allocations.length} fonds
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(deposit.amount)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-foreground-muted transition-transform ${
                      expandedId === deposit._id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === deposit._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                      {deposit.allocations.map((alloc) => (
                        <div
                          key={alloc.isin}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate">{alloc.fundName}</p>
                            <p className="text-xs text-foreground-muted">
                              {alloc.sharesAcquired.toFixed(4)} {t("shares")} @ {formatCurrency(alloc.sharePrice)}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="font-medium text-foreground">
                              {formatCurrency(alloc.amountInvested)}
                            </p>
                            <p className="text-xs text-foreground-muted">
                              {alloc.percentage}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
