import { runQuery } from "@/utils/tanstack-runner";
import { useQuery } from "@tanstack/react-query";
import { getActiveShiftTransactions } from "./queries";

export function useAllTransactions() {
  return useQuery({
    queryKey: ["transactions", "shift"],
    queryFn: () => runQuery(getActiveShiftTransactions),
  });
}
