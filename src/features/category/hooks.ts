"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { Category } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "@/types";
import { getAllCategories } from "./queries";
import { runAction, runQuery } from "@/utils/tanstack-runner";
import { CategorySchema, CategoryInput } from "./schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory, deleteCategory } from "./actions";

export function useCategoryForm(category?: Category) {
  const queryClient = useQueryClient();

  const form = useForm<CategoryInput>({
    resolver: zodResolver(CategorySchema),
    mode: "onTouched",
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: (data: CategoryInput) =>
      runAction(() => {
        return category ? updateCategory(category.id, data) : createCategory(data);
      }),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof CategoryInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutateAsync, isPending, result: data };
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteCategory(id)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => runQuery(getAllCategories),
  });
}
