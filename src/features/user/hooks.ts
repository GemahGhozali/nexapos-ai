"use client";

import { User } from "./types";
import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getAllUsers } from "./queries";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "@/types";
import { runQuery, runAction } from "@/utils/tanstack-runner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, updateUser } from "./actions";
import { CreateUserInput, CreateUserSchema, UpdateUserInput, UpdateUserSchema } from "./schemas";

export function useUserForm(user?: User) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(user ? UpdateUserSchema : CreateUserSchema),
    mode: "onTouched",
    defaultValues: {
      fullname: user?.fullname ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "cashier",
      profileImage: user?.profileImage ?? null,
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationFn: (data: CreateUserInput | UpdateUserInput) =>
      runAction(() => {
        return user ? updateUser(user.id, data as UpdateUserInput) : createUser(data as CreateUserInput);
      }),

    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.replace("/dashboard/user");
    },

    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });

      if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof (CreateUserInput | UpdateUserInput), { type: "server", message });
        });
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return { onSubmit, form, isPending, result: data };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => runAction(() => deleteUser(id)),
    onSuccess: (response) => {
      toast.add({ type: "success", description: response.message });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => runQuery(getAllUsers),
  });
}
