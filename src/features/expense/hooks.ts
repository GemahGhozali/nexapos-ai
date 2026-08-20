"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpense } from "./actions";
import { getAllExpenses } from "./queries";
import { ActionResponse } from "@/types";
import { runAction, runQuery } from "@/utils/tanstack-runner";
import { ExpenseSchema, ExpenseInput } from "./schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExpenseForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ExpenseInput>({
    resolver: zodResolver(ExpenseSchema),
    mode: "onTouched",
    defaultValues: {
      date: new Date(),
      amount: 0,
      category: "",
      paymentMethod: "cash",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ExpenseInput) => runAction(() => createExpense(data)),

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

export function useAllExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => runQuery(getAllExpenses),
  });
}
