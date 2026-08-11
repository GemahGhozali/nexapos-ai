"use client";

import { cn } from "@/libs/shadcn";
import { Button } from "@/components/ui/button";
import { Category } from "../types";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAllCategories } from "../hooks";
import { CategoryTableEmpty } from "./category-table-empty";
import { CategoryTableError } from "./category-table-error";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { CategoryTableSkeleton } from "./category-table-skeleton";
import { PencilEdit02Icon, Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CategoryAction = "create" | "update" | "delete";

export function CategoryTable() {
  const { data, isPending, isFetching, isError, error, refetch } = useAllCategories();

  const [action, setAction] = useState<CategoryAction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const categoryFormDialogOpen = action === "create" || action === "update";
  const deleteCategoryDialogOpen = action === "delete";

  const handleCreateCategory = () => {
    setSelectedCategory(undefined);
    setAction("create");
  };

  const handleUpdateCategory = (category: Category) => {
    setSelectedCategory(category);
    setAction("update");
  };

  const handlDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setAction("delete");
  };

  const renderTable = () => {
    if (isPending || isFetching) return <CategoryTableSkeleton />;

    if (isError) return <CategoryTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <CategoryTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Total Produk</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className={cn(!product.description && "italic")}>{product.description || "Tidak ada deskripsi"}</TableCell>
              <TableCell>{product.totalProduct}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleUpdateCategory(product)}>
                  <HugeiconsIcon icon={PencilEdit02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handlDeleteCategory(product)}>
                  <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Kategori</CardTitle>
          <CardDescription>Daftar semua data kategori produk produk yang tersedia</CardDescription>
          <CardAction>
            <Button type="button" onClick={handleCreateCategory}>
              Tambah Kategori
              <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-end" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>
      <CategoryFormDialog category={selectedCategory} open={categoryFormDialogOpen} onClose={() => setAction(null)} />
      <DeleteCategoryDialog category={selectedCategory} open={deleteCategoryDialogOpen} onClose={() => setAction(null)} />
    </>
  );
}
