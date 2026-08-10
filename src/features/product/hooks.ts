"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { Product } from "./types";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "@/types";
import { getAllProducts } from "./queries";
import { runAction, runQuery } from "@/utils/tanstack-runner";
import { ProductSchema, ProductInput } from "./schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct } from "./actions";

export function useProductForm(product?: Product) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    mode: "onTouched",
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? 0,
      hpp: product?.hpp ?? 0,
      categoryId: product?.category?.id ?? "",
      image: product?.image ?? null,
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationFn: (data: ProductInput) =>
      runAction(() => {
        return product ? updateProduct(product.id, data) : createProduct(data);
      }),

    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.replace("/dashboard/product");
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof ProductInput, { type: "server", message });
        });
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return { onSubmit, form, isPending, result: data };
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteProduct(id)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => runQuery(getAllProducts),
  });
}
