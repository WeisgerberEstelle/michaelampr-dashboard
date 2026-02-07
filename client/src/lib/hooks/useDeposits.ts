import useSWR from "swr";
import api from "../api";
import { Deposit } from "@/types/deposit";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useDeposits() {
  return useSWR<Deposit[]>("/deposits", fetcher);
}
