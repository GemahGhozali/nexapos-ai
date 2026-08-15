"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { runAction } from "@/utils/tanstack-runner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ActionResponse } from "@/types";
import { openShift, closeShift } from "./actions";
import { OpeningShiftSchema, OpeningShiftInput, ClosingShiftSchema, ClosingShiftInput } from "./schemas";

export function useOpenShiftForm() {
  const form = useForm<OpeningShiftInput>({
    resolver: zodResolver(OpeningShiftSchema),
    mode: "onTouched",
    defaultValues: {
      openingCash: 0,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["open-shift"],
    mutationFn: (data: OpeningShiftInput) => runAction(() => openShift(data)),
    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  return { mutateAsync, form, isPending };
}

export function useCloseShiftForm() {
  const form = useForm<ClosingShiftInput>({
    resolver: zodResolver(ClosingShiftSchema),
    mode: "onTouched",
    defaultValues: {
      closingCash: 0,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["close-shift"],
    mutationFn: (data: ClosingShiftInput) => runAction(() => closeShift(data)),
    onSuccess: (response: ActionResponse) => {
      toast.add({ type: "success", description: response.message });
    },
    onError: (response: ActionResponse) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  return { mutateAsync, form, isPending };
}
