"use client";

import { Spinner } from "@/components/ui/spinner";
import { ProductInput } from "../schemas";
import { useAllCategories } from "@/features/category/hooks";
import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectProps {
  form: UseFormReturn<ProductInput>;
  disabled: boolean;
}

export function CategorySelect({ form, disabled }: CategorySelectProps) {
  const { data = [], isPending } = useAllCategories();

  const isDisable = isPending || data.length === 0 || disabled;

  return (
    <Controller
      control={form.control}
      name="categoryId"
      render={({ field, fieldState }) => {
        const selectedCategory = data.find((category) => category.id === field.value);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="category">Kategori (Opsional)</FieldLabel>
            <Select
              disabled={isDisable}
              value={field.value}
              onValueChange={field.onChange}
              onOpenChange={(open) => {
                if (!open) {
                  field.onBlur();
                }
              }}
            >
              <SelectTrigger id="category" aria-invalid={fieldState.invalid} disabled={isDisable}>
                {isPending ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Spinner />
                    <span>Sedang mengambil data kategori...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={data.length === 0 ? "Tidak ada data kategori apapun" : "Silahkan pilih kategori produk disini..."}>
                    {selectedCategory?.name}
                  </SelectValue>
                )}
              </SelectTrigger>

              {data.length > 0 && (
                <SelectContent>
                  <SelectItem value="">Tidak Terkategori</SelectItem>
                  {data.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
