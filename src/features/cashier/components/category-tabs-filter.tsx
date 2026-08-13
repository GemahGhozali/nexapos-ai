import { Category } from "@/features/category/types";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsFilterProps {
  categories: Category[];
}

export function CategoryTabsFilter({ categories }: CategoryTabsFilterProps) {
  return (
    <div className="overflow-x-auto overflow-y-hidden scrollbar-none">
      <TabsList>
        <TabsTrigger value="Semua Produk">Semua Produk</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.name}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
