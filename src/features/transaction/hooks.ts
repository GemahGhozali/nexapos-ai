import { runQuery } from "@/utils/tanstack-runner";
import { useQuery } from "@tanstack/react-query";
import { getActiveShiftTransactions, getAllTransactions } from "./queries";

interface UseAllCashflowsParams {
  showDataFromActiveShiftOnly: boolean;
}

export function useAllTransactions({ showDataFromActiveShiftOnly }: UseAllCashflowsParams) {
  return useQuery({
    queryKey: showDataFromActiveShiftOnly ? ["transactions", "shift"] : ["transactions", "all"],
    queryFn: () => runQuery(showDataFromActiveShiftOnly ? getActiveShiftTransactions : getAllTransactions),
  });
}
