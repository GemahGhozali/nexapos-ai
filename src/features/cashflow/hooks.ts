"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "@/types";
import { runAction, runQuery } from "@/utils/tanstack-runner";
import { CashflowSchema, CashflowInput } from "./schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveShiftCashflows, getAllCashflows } from "./queries";
import { createCashflowData, createCashflowDataInActiveShift } from "./actions";

interface UseCashflowFormParams {
  insertDataIntoActiveShift: boolean;
}

interface UseAllCashflowsParams {
  showDataFromActiveShiftOnly: boolean;
}

export function useCashflowForm({ insertDataIntoActiveShift }: UseCashflowFormParams) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CashflowInput>({
    resolver: zodResolver(CashflowSchema),
    mode: "onTouched",
    defaultValues: {
      type: "income",
      amount: 0,
      category: "",
      description: "",
      paymentMethod: "cash",
      date: new Date(),
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CashflowInput) =>
      runAction(() => {
        return insertDataIntoActiveShift ? createCashflowDataInActiveShift(data) : createCashflowData(data);
      }),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["cashflows"] });
      router.back();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof CashflowInput, { type: "server", message });
        });
      }
    },
  });

  return { mutateAsync, form, isPending };
}

export function useAllCashflows({ showDataFromActiveShiftOnly }: UseAllCashflowsParams) {
  return useQuery({
    queryKey: showDataFromActiveShiftOnly ? ["cashflows", "shift"] : ["cashflows", "all"],
    queryFn: () => runQuery(showDataFromActiveShiftOnly ? getActiveShiftCashflows : getAllCashflows),
  });
}
