"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { HugeiconsIcon } from "@hugeicons/react";
import { useExpenseForm } from "../hooks";
import { EXPENSE_CATEGORIES } from "../schemas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCardIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { CreatationConfirmationDialog } from "./creation-confirmation-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";

export function ExpenseForm() {
  const router = useRouter();

  const {
    form,
    mutation: { isPending, mutateAsync },
  } = useExpenseForm();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-semibold">Tambah Pengeluaran</CardTitle>
        <CardDescription>Silahkan isi semua informasi dibawah untuk mencatat pengeluaran</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* Date */}
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="date">
                  Tanggal <span className="text-red-600">*</span>
                </FieldLabel>
                <DatePicker
                  id="date"
                  onBlur={field.onBlur}
                  invalid={fieldState.invalid}
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date ?? "")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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
                <FieldLabel htmlFor="description">Keterangan (Opsional)</FieldLabel>
                <Textarea {...field} id="description" aria-invalid={fieldState.invalid} placeholder="Masukkan keterangan disini..." />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field orientation="horizontal" className="max-sm:flex-col max-sm:items-stretch justify-end">
            <Button size="lg" variant="secondary" disabled={isPending} onClick={() => router.back()}>
              Batalkan
            </Button>
            <CreatationConfirmationDialog form={form} mutationFn={mutateAsync} isPending={isPending} isFormValid={!form.formState.isValid} />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
