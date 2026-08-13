"use client";

import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { CartSheet } from "./shopping-cart-sheet";
import { useCashierCatalog } from "../queries";
import { CategoryTabsFilter } from "./category-tabs-filter";
import { ProductTabsContent } from "./product-tabs-content";
import { CashierCatalogError } from "./cashier-catalog-error";
import { CashierCatalogSkeleton } from "./cashier-catalog-skeleton";

export function CashierCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Produk");

  const { categories, products, isPending, isError, error, refetch } = useCashierCatalog();

  if (isPending) return <CashierCatalogSkeleton />;

  if (isError) return <CashierCatalogError error={error} refetch={refetch} />;

  return (
    <>
      <Tabs defaultValue="Semua Produk" value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <CategoryTabsFilter categories={categories} />
        <ProductTabsContent products={products} selectedCategory={selectedCategory} />
      </Tabs>
      <CartSheet />
    </>
  );
}
