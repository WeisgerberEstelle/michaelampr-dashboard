export interface DashboardSummary {
  totalCurrentValue: number;
  totalInvested: number;
  gain: number;
}

export interface LineChartPoint {
  date: string;
  value: number;
}

export interface PieChartEntry {
  name: string;
  value: number;
}
