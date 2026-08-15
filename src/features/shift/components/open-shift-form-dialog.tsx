"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useOpenShiftForm } from "../hooks";
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export function OpenShiftFormDialog() {
  const { mutateAsync: openShift, form, isPending } = useOpenShiftForm();
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = form.handleSubmit(async (data) => {
    await openShift(data);
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset({ openingCash: 0 });
        }
      }}
    >
      <DialogTrigger render={<Button>Buka Shift</Button>} />
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup>
            <Controller
              name="openingCash"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="openingCash">Modal Kas Awal</FieldLabel>
                  <FieldDescription>Silahkan masukkan modal kas awal yang dimiliki saat ini. Jika tidak ada, boleh dikosongkan.</FieldDescription>
                  <Input
                    {...field}
                    id="openingCash"
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
              {isPending ? "Memproses" : "Buka Shift"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
