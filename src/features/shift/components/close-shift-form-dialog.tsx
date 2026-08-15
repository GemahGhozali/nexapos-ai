"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useCloseShiftForm } from "../hooks";
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export function CloseShiftFormDialog() {
  const { mutateAsync: closeShift, form, isPending } = useCloseShiftForm();
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = form.handleSubmit(async (data) => {
    await closeShift(data);
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset({ closingCash: 0 });
        }
      }}
    >
      <DialogTrigger render={<Button variant="secondary">Tutup Shift</Button>} />
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup>
            <Controller
              name="closingCash"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="closingCash">
                    Kas Fisik Saat Ini <span className="text-red-600">*</span>
                  </FieldLabel>
                  <FieldDescription>Silahkan masukkan uang kas fisik yang dimiliki saat ini.</FieldDescription>
                  <Input
                    {...field}
                    id="closingCash"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan modal kas awal disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Batalkan</Button>} />
            <Button type="submit" disabled={isPending || !form.formState.isValid}>
              {isPending ? "Memproses" : "Tutup Shift"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
