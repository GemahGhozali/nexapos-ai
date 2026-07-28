"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { runAction } from "@/utils/tanstack-runner";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, logout } from "./actions";
import { ActionResponse } from "@/types";
import { LoginSchema, LoginInput } from "./schemas";

export function useLoginForm() {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationFn: (data: LoginInput) => runAction(() => login(data)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/dashboard");
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof LoginInput, { type: "server", message });
        });
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return { onSubmit, form, isPending, result: data };
}

export function useLogout() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => runAction(logout),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      router.replace("/login");
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  return { logout: mutate, isPending };
}
