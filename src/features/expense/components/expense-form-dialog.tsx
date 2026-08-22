"use client";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { ActionResponse } from "@/types";
import { UseMutationResult } from "@tanstack/react-query";
import { Controller, UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EXPENSE_CATEGORIES, ExpenseInput } from "../schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Alert02Icon, CreditCardIcon, PlusSignIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";

interface ExpenseFormDialogProps {
  form: UseFormReturn<ExpenseInput>;
  mutation: UseMutationResult<ActionResponse, ActionResponse, ExpenseInput, unknown>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ExpenseFormDialog({ form, mutation, open, setOpen }: ExpenseFormDialogProps) {
  const { isPending, mutateAsync: createExpense } = mutation;

  const resetForm = () => form.reset({ amount: 0, category: "", paymentMethod: "cash", description: "" });

  const onSubmit = form.handleSubmit(async (data) => {
    await createExpense(data);
    setOpen(false);
    resetForm();
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            Tambah Pengeluaran <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-end" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="font-semibold">Tambah Pengeluaran</DialogTitle>
            <DialogDescription>Isi informasi dibawah untuk mencatat pengeluaran.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {/* Payment Method */}
            <Controller
              name="paymentMethod"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Metode Pembayaran <span className="text-red-600">*</span>
                  </FieldLabel>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="grid-cols-2"
                  >
                    <FieldLabel htmlFor="cash" className="cursor-pointer">
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldTitle>
                            <HugeiconsIcon icon={Wallet01Icon} size={18} className="text-primary" strokeWidth={2} />
                            Tunai
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="cash" id="cash" aria-invalid={fieldState.invalid} />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="transfer" className="cursor-pointer">
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldTitle>
                            <HugeiconsIcon icon={CreditCardIcon} size={18} className="text-primary" strokeWidth={2} />
                            Transfer
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="transfer" id="transfer" aria-invalid={fieldState.invalid} />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldSet>
              )}
            />

            {/* Amount */}
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="amount">
                    Total Pengeluaran <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan total nominal disini..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Category */}
            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category">
                    Kategori <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    onOpenChange={(open) => {
                      if (!open) {
                        field.onBlur();
                      }
                    }}
                  >
                    <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Pilih kategori disini..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    Keterangan <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Textarea {...field} id="description" aria-invalid={fieldState.invalid} placeholder="Masukkan keterangan disini..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Alert className="bg-yellow-600/10 border-0">
              <HugeiconsIcon icon={Alert02Icon} size={16} className="text-yellow-500!" strokeWidth={1.5} />
              <AlertTitle>Peringatan!</AlertTitle>
              <AlertDescription>
                Data yang sudah disimpan <b>tidak dapat diubah atau dihapus</b> lagi. Pastikan data yang anda input sudah benar!
              </AlertDescription>
            </Alert>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isPending}>
                  Batalkan
                </Button>
              }
            />
            <Button type="submit" disabled={isPending || !form.formState.isValid}>
              {isPending ? "Memproses" : "Tambah Pengeluaran"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
