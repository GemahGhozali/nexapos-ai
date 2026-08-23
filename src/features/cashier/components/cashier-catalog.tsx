"use client";

import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useState } from "react";
import { AIWizard } from "@/features/ai/wizard/components/ai-wizard";
import { CartSheet } from "./shopping-cart-sheet";
import { useCartStore } from "../stores";
import { useCashierCatalog } from "../queries";
import { getProductImageURL } from "@/features/product/utils";
import { CategoryTabsFilter } from "./category-tabs-filter";
import { ProductTabsContent } from "./product-tabs-content";
import { CashierCatalogError } from "./cashier-catalog-error";
import { CashierCatalogSkeleton } from "./cashier-catalog-skeleton";

export function CashierCatalog() {
  const { addToCart } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Produk");

  const { categories, products, isPending, isError, error, refetch } = useCashierCatalog();

  if (isPending) return <CashierCatalogSkeleton />;

  if (isError) return <CashierCatalogError error={error} refetch={refetch} />;

  return (
    <div className="space-y-6">
      <AIWizard
        allowedTools={["add_to_cart"]}
        placeholders={["Nasi Goreng 1...", "Nasi Goreng 1, Mie Ayam 1...", "Nasi Goreng 1, Mie Ayam 1, Es Teh 2..."]}
        onGetResult={(response) => {
          if (response.data.action.name === "add_to_cart") {
            const items = response.data.action.payload.items.map((item) => ({ ...item, image: getProductImageURL(item.image) }));
            items.forEach((item) => addToCart(item));
            toast.add({ type: "success", description: response.message });
          }
        }}
      />
      <Tabs defaultValue="Semua Produk" value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <CategoryTabsFilter categories={categories} />
        <ProductTabsContent products={products} selectedCategory={selectedCategory} />
      </Tabs>
      <CartSheet />
    </div>
  );
}
