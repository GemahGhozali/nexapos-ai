"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCheckoutForm } from "../hooks";
import { Controller, useWatch } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft02Icon, CreditCardIcon, ShoppingCart01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";

interface CheckoutFormDialogProps {
  onCheckoutSuccess: () => void;
}

export function CheckoutFormSheet({ onCheckoutSuccess }: CheckoutFormDialogProps) {
  const {
    form,
    totalAmount,
    mutation: { isPending, mutateAsync },
  } = useCheckoutForm();

  const [open, setOpen] = useState<boolean>(false);

  const selectedPaymentMethod = useWatch({ control: form.control, name: "paymentMethod" });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data);
    setOpen(false);
    onCheckoutSuccess();
  });

  return (
    <Sheet
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen(open);
        if (!open) {
          form.setValue("paidAmount", totalAmount, { shouldValidate: true });
        }
      }}
    >
      <SheetTrigger render={<Button className="w-full">Checkout Transaksi</Button>} />
      <SheetContent showCloseButton={false}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="border-b p-4 flex-row gap-3 items-center">
            <SheetClose
              render={
                <Button variant="ghost" size="icon-sm" type="button">
                  <HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} color="currentColor" />
                </Button>
              }
            />
            <SheetTitle>Checkout Transaksi</SheetTitle>
          </SheetHeader>
          <div className="mx-auto pt-6 pb-4 flex flex-col items-center">
            <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center mb-3">
              <HugeiconsIcon icon={ShoppingCart01Icon} size={24} color="currentColor" strokeWidth={1.75} />
            </div>
            <p className="text-muted-foreground">Total Keseluruhan</p>
            <p className="font-semibold text-2xl">{formatToIDR(totalAmount)}</p>
          </div>
          <FieldGroup className="grow p-4">
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
                    onValueChange={(value: "cash" | "transfer") => {
                      field.onChange(value);
                      form.setValue("paidAmount", totalAmount, { shouldValidate: true });
                    }}
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
                            Midtrans
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="transfer" id="transfer" aria-invalid={fieldState.invalid} />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {selectedPaymentMethod === "transfer" && (
                    <FieldDescription>Anda akan diarahkan ke halaman pembayaran Midtrans Sandbox.</FieldDescription>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldSet>
              )}
            />
            {selectedPaymentMethod === "cash" && (
              <Controller
                name="paidAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="paidAmount">
                      Nominal Pembayaran <span className="text-red-600">*</span>
                    </FieldLabel>
                    <FieldDescription>Masukkan nominal uang yang diterima.</FieldDescription>
                    <Input
                      {...field}
                      id="paidAmount"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan nominal pembayaran disini..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
          <SheetFooter className="border-t p-4">
            <Button type="submit" disabled={isPending || !form.formState.isValid} className="w-full">
              {isPending ? "Memproses" : selectedPaymentMethod === "transfer" ? "Bayar via Midtrans" : "Konfirmasi Pembayaran"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
