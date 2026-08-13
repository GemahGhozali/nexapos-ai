import Image from "next/image";
import { CartItem } from "../types";
import { Separator } from "@/components/ui/separator";
import { Image03Icon } from "@hugeicons/core-free-icons";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuantityChanger } from "./quantity-changer";

interface ShoppingCartItemProps {
  item: CartItem;
}

export function ShoppingCartItem({ item }: ShoppingCartItemProps) {
  return (
    <div className="p-3 space-y-3 border rounded-lg">
      <div className="flex items-end gap-3">
        <div className="relative overflow-hidden rounded shrink-0 size-11">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="grid place-content-center size-full bg-muted">
              <HugeiconsIcon icon={Image03Icon} size={16} strokeWidth={1.5} color="currentColor" />
            </div>
          )}
        </div>
        <div>
          <p className="font-heading font-medium line-clamp-1">{item.name}</p>
          <p className="text-sm text-muted-foreground">{formatToIDR(item.price)}</p>
        </div>
        <QuantityChanger item={item} size="icon-xs" className="ml-auto" />
      </div>
      <Separator />
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Total Harga :</p>
        <p className="text-sm font-semibold">{formatToIDR(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
