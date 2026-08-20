"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { ExpenseInput } from "../schemas";
import { HugeiconsIcon } from "@hugeicons/react";
import { UseFormReturn } from "react-hook-form";
import { ActionResponse } from "@/types";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

interface CreatationConfirmationDialogProps {
  form: UseFormReturn<ExpenseInput>;
  isPending: boolean;
  isFormValid: boolean;
  mutationFn: UseMutateAsyncFunction<ActionResponse, ActionResponse, ExpenseInput, unknown>;
}

export function CreatationConfirmationDialog({ form, mutationFn, isPending, isFormValid }: CreatationConfirmationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = form.handleSubmit(async (data) => {
    await mutationFn(data);
    setOpen(false);
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button disabled={isFormValid}>Tambah Pengeluaran</Button>} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="text-yellow-500 bg-yellow-500/10">
            <HugeiconsIcon icon={Alert02Icon} size={16} color="currentColor" strokeWidth={1.5} />
          </AlertDialogMedia>
          <AlertDialogTitle>Peringatan!</AlertDialogTitle>
          <AlertDialogDescription>
            Data yang sudah disimpan <b>tidak dapat diubah atau dihapus</b> lagi. Apakah anda sudah yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Tidak</AlertDialogCancel>
          <form onSubmit={onSubmit}>
            <AlertDialogAction type="submit" disabled={isPending} className="w-full">
              {isPending ? "Memproses" : "Ya, Simpan"}
              {isPending && <Spinner data-icon="inline-start" />}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
