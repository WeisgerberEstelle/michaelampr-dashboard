"use client";

import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LineChartPoint } from "@/types/dashboard";

interface SavingsLineChartProps {
  data: LineChartPoint[];
}

export default function SavingsLineChart({ data }: SavingsLineChartProps) {
  const t = useTranslations("dashboard");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-surface rounded-xl p-5 shadow-sm">
      <h2 className="font-title text-lg font-semibold text-foreground mb-4">
        {t("evolutionTitle")}
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Valeur"]}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#860369"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#860369" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
