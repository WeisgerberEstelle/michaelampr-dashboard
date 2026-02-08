import React from "react";

export const useTranslations = (namespace: string) => {
  const translations: Record<string, Record<string, string>> = {
    dashboard: {
      allocationTitle: "Répartition par fonds",
      totalSavings: "Épargne totale",
      totalInvested: "Montant investi",
      gain: "Plus-value",
      loss: "Moins-value",
    },
    deposit: {
      amount: "Montant (EUR)",
      amountPlaceholder: "1000",
      rib: "RIB",
      ribPlaceholder: "FR7630001007941234567890185",
      bic: "BIC",
      bicPlaceholder: "BNPAFRPP",
      date: "Date du versement",
      submit: "Valider le versement",
      submitting: "Envoi en cours...",
      errorAmountPositive: "Le montant doit être supérieur à 0",
      errorIbanFormat: "Format IBAN invalide",
      errorBicFormat: "Format BIC invalide",
      errorDateRequired: "La date est requise",
      errorGeneric: "Une erreur est survenue",
    },
    fundSelector: {
      legend: "Sélectionnez vos fonds",
    },
    allocationSlider: {
      legend: "Répartition de l'investissement",
      percentage: "Pourcentage",
      total: "Total",
      errorTotal: "Le total doit être égal à 100%",
    },
  };
  return (key: string) => translations[namespace]?.[key] ?? key;
};

export const NextIntlClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
