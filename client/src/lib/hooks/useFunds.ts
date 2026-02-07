import useSWR from "swr";
import api from "../api";
import { Fund, FundWithLatestVL } from "@/types/fund";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useFunds() {
  return useSWR<Fund[]>("/funds", fetcher);
}

export function useFundsLatestVL() {
  return useSWR<FundWithLatestVL[]>("/funds/valorisations/latest", fetcher);
}
