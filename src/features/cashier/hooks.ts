"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/tanstack-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "./stores";
import { ActionResponse } from "@/types";
import { createTransaction } from "@/features/transaction/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutTransactionInput, CheckoutTransactionSchema } from "@/features/transaction/schemas";

function getPaymentRedirectUrl(response: ActionResponse): string | null {
  const candidate: unknown = response;

  if (typeof candidate !== "object" || candidate === null || !("data" in candidate)) {
    return null;
  }

  const data = candidate.data;

  if (typeof data !== "object" || data === null || !("redirectUrl" in data) || typeof data.redirectUrl !== "string") {
    return null;
  }

  return data.redirectUrl;
}

export function useCheckoutForm() {
  const { cart, clearCart } = useCartStore((state) => state);
  const queryClient = useQueryClient();

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const items = cart.map((item) => ({ productId: item.id, quantity: item.quantity }));

  const form = useForm<CheckoutTransactionInput>({
    resolver: zodResolver(CheckoutTransactionSchema),
    mode: "onChange",
    values: {
      paymentMethod: "cash",
      paidAmount: totalAmount,
      totalAmount,
      items,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CheckoutTransactionInput) => runAction(() => createTransaction(data)),

    onSuccess: (response: ActionResponse) => {
      const redirectUrl = getPaymentRedirectUrl(response);

      if (redirectUrl) {
        toast.add({ type: "success", description: "Pembayaran siap diproses di Midtrans." });
        clearCart();
        form.reset();
        window.location.assign(redirectUrl);
        return;
      }

      toast.add({ type: "success", description: response.message });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      clearCart();
      form.reset();
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof CheckoutTransactionInput, { type: "server", message });
        });
      }
    },
  });

  return { form, mutation, totalAmount };
}
