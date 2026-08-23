import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/product/types";
import { formatToIDR } from "@/utils/format-to-idr";
import { useCartStore } from "../stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuantityChanger } from "./quantity-changer";
import { Image03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const item = useCartStore((state) => state.cart.find((cartItem) => cartItem.id === product.id));
  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = () => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });

  const renderButton = () => {
    if (!item) {
      return (
        <Button className="w-full" size="lg" onClick={handleAddToCart}>
          Tambah Produk
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} color="currentColor" data-icon="inline-end" />
        </Button>
      );
    }

    return <QuantityChanger item={item} className="w-full justify-between" />;
  };

  return (
    <Card className="relative pt-0 gap-4 pb-4">
      <div className="relative aspect-square overflow-hidden border-b">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="grid place-content-center size-full bg-muted text-muted-foreground">
            <HugeiconsIcon icon={Image03Icon} size={64} strokeWidth={1.5} color="currentColor" />
          </div>
        )}
        {product.category && (
          <CardAction>
            <Badge variant="outline" className="absolute top-4 right-4">
              {product.category.name}
            </Badge>
          </CardAction>
        )}
      </div>
      <CardHeader className="px-4">
        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        <CardDescription>{formatToIDR(product.price)}</CardDescription>
      </CardHeader>
      <CardFooter className="px-4">{renderButton()}</CardFooter>
    </Card>
  );
}
