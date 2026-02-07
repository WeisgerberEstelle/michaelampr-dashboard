import useSWR from "swr";
import api from "../api";
import { DashboardSummary, LineChartPoint, PieChartEntry } from "@/types/dashboard";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useDashboardSummary() {
  return useSWR<DashboardSummary>("/dashboard/summary", fetcher);
}

export function useLineChart() {
  return useSWR<LineChartPoint[]>("/dashboard/linechart", fetcher);
}

export function usePieChart() {
  return useSWR<PieChartEntry[]>("/dashboard/piechart", fetcher);
}
