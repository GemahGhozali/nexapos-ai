"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Product } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { ImageUploader } from "@/components/image-uploader";
import { useProductForm } from "../hooks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const { form, isPending, onSubmit } = useProductForm(product);

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Update Data Produk" : "Tambah Data Produk"}</CardTitle>
          <CardDescription>Masukkan informasi dibawah untuk membuat data produk</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {/* Image */}
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <ImageUploader
                    label="Gambar Produk (Opsional)"
                    description="JPEG, JPG, PNG and WEBP, Maks. 1 MB"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Nama Produk <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan nama produk disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* HPP */}
            <Controller
              name="hpp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="hpp">
                    Estimasi HPP <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="hpp"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan estimasi HPP disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Price */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">
                    Harga <span className="text-red-600">*</span>
                  </FieldLabel>
                  <FieldDescription>Harga harus lebih besar dari HPP</FieldDescription>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan harga disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Link href={`/dashboard/product`} className={buttonVariants({ variant: "outline" })} aria-disabled={isPending}>
            Batal
          </Link>
          <Button type="submit" size="lg" disabled={isPending || !form.formState.isValid}>
            {isPending ? "Processing" : product ? "Update Data Produk" : "Tambah Data Produk"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
