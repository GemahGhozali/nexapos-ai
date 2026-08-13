"use client";

import { useMemo } from "react";
import { Product } from "@/features/product/types";
import { ProductCard } from "./product-card";
import { TabsContent } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon } from "@hugeicons/core-free-icons";

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
}

export function ProductTabsContent({ products, selectedCategory }: ProductCatalogProps) {
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Semua Produk") return products;

    return products.filter((product) => product?.category?.name === selectedCategory);
  }, [products, selectedCategory]);

  if (filteredProducts.length === 0) {
    return (
      <div className="p-4 border rounded-lg flex items-center gap-4">
        <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center">
          <HugeiconsIcon icon={PackageIcon} size={24} color="currentColor" strokeWidth={1.75} />
        </div>
        <div className="space-x-1">
          <p className="font-semibold text-foreground font-heading">Produk tidak ditemukan</p>
          <p className="text-muted-foreground">Tidak ada produk yang masuk ke dalam kategori {`'${selectedCategory}'`}</p>
        </div>
      </div>
    );
  }

  return (
    <TabsContent value={selectedCategory}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </TabsContent>
  );
}
