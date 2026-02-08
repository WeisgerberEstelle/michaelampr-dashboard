export interface Fund {
  _id: string;
  isin: string;
  fundName: string;
}

export interface FundWithLatestVL {
  isin: string;
  fundName: string;
  latestValorisation: {
    date: string;
    value: number;
  } | null;
}
