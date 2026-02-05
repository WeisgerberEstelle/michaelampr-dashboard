import useSWR from "swr";
import api from "../api";
import { Fund } from "@/types/fund";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useFunds() {
  return useSWR<Fund[]>("/funds", fetcher);
}

