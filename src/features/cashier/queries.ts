import { runQuery } from "@/utils/tanstack-runner";
import { useQueries } from "@tanstack/react-query";
import { getAllProducts } from "../product/queries";
import { getAllCategories } from "../category/queries";

export function useCashierCatalog() {
  return useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: () => runQuery(getAllCategories),
      },
      {
        queryKey: ["products"],
        queryFn: () => runQuery(getAllProducts),
      },
    ],
    combine: (results) => {
      return {
        categories: results[0].data ?? [],
        products: results[1].data ?? [],
        isPending: results.some((result) => result.isPending),
        isError: results.some((result) => result.isError),
        error: results.find((result) => result.error)?.error,
        refetch: () => Promise.all(results.map((result) => result.refetch())),
      };
    },
  });
}
