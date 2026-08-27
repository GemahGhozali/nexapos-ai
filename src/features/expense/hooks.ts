"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "@/types";
import { runAction, runQuery } from "@/utils/tanstack-runner";
import { ExpenseSchema, ExpenseInput } from "./schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveShiftExpenses, getAllExpenses } from "./queries";
import { createExpense, createExpenseInActiveShift } from "./actions";

interface UseExpenseFormParams {
  insertDataIntoActiveShift: boolean;
}

interface UseAllExpensesParams {
  showDataFromActiveShiftOnly: boolean;
}

export function useExpenseForm({ insertDataIntoActiveShift }: UseExpenseFormParams) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ExpenseInput>({
    resolver: zodResolver(ExpenseSchema),
    mode: "onTouched",
    defaultValues: {
      amount: 0,
      category: "",
      paymentMethod: "cash",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ExpenseInput) =>
      runAction(() => {
        return insertDataIntoActiveShift ? createExpenseInActiveShift(data) : createExpense(data);
      }),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      router.replace("/dashboard/expense");
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ExpenseInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation };
}

export function useAllExpenses({ showDataFromActiveShiftOnly }: UseAllExpensesParams) {
  return useQuery({
    queryKey: showDataFromActiveShiftOnly ? ["expenses", "shift"] : ["expenses", "all"],
    queryFn: () => runQuery(showDataFromActiveShiftOnly ? getActiveShiftExpenses : getAllExpenses),
  });
}
