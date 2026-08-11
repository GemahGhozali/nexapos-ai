"use client";

import Link from "next/link";
import { cn } from "@/libs/shadcn";
import { Product } from "../types";
import { useState } from "react";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAllProducts } from "../hooks";
import { ProductTableEmpty } from "./product-table-empty";
import { ProductTableError } from "./product-table-error";
import { DeleteProductDialog } from "./delete-product-dialog";
import { ProductTableSkeleton } from "./product-table-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HashtagIcon, PencilEdit02Icon, Delete02Icon, PlusSignIcon, Image03Icon } from "@hugeicons/core-free-icons";

export function ProductTable() {
  const { data, isPending, isFetching, isError, error, refetch } = useAllProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const renderTable = () => {
    if (isPending || isFetching) return <ProductTableSkeleton />;

    if (isError) return <ProductTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <ProductTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <HugeiconsIcon icon={HashtagIcon} size={16} color="currentColor" strokeWidth={1.5} className="mx-auto" />
            </TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Estimasi HPP</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="w-10">
                <Avatar size="lg">
                  <AvatarImage src={product.image || ""} alt={product.name} />
                  <AvatarFallback className="font-semibold">
                    <HugeiconsIcon icon={Image03Icon} size={16} strokeWidth={1.5} color="currentColor" />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatToIDR(product.hpp)}</TableCell>
              <TableCell>{formatToIDR(product.price)}</TableCell>
              <TableCell className={cn(!product.category && "italic")}>{product.category ? product.category.name : "Tidak Terkategori"}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/dashboard/product/${product.id}/update`} className={buttonVariants({ variant: "outline", size: "icon" })}>
                  <HugeiconsIcon icon={PencilEdit02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </Link>
                <Button variant="outline" size="icon" onClick={() => setSelectedProduct(product)}>
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
          <CardTitle>Data Produk</CardTitle>
          <CardDescription>Daftar semua data produk yang tersedia</CardDescription>
          <CardAction>
            <Link href="/dashboard/product/create" className={buttonVariants({ variant: "default" })}>
              Tambah Produk
              <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-end" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>
      <DeleteProductDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
