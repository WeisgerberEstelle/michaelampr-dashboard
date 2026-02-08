export interface Allocation {
  fundId: string;
  isin: string;
  fundName: string;
  percentage: number;
  amountInvested: number;
  sharePrice: number;
  sharesAcquired: number;
}

export interface Deposit {
  _id: string;
  userId: string;
  amount: number;
  rib: string;
  bic: string;
  date: string;
  allocations: Allocation[];
  createdAt: string;
}
