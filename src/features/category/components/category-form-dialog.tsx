"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "../types";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useCategoryForm } from "../hooks";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryFormDialogProps {
  open: boolean;
  category?: Category;
  onClose: () => void;
}

export function CategoryFormDialog({ category, open, onClose }: CategoryFormDialogProps) {
  const { form, mutateAsync: runMutationFn, isPending } = useCategoryForm(category);

  const onSubmit = form.handleSubmit(async (data) => {
    await runMutationFn(data);
    onClose();
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        description: category?.description || "",
      });
    }
  }, [category, open, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>{category ? "Update Data Kategori" : "Tambah Data Kategori"}</DialogTitle>
            <DialogDescription>Masukkan nama dan deskripsi kategori</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Nama Kategori <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan nama kategori disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
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
                  <FieldLabel htmlFor="description">Deskripsi (Opsional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan deskripsi disini..."
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
              {isPending ? "Memproses" : category ? "Update Data Kategori" : "Tambah Data Kategori"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
