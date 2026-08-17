import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Image03Icon } from "@hugeicons/core-free-icons";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { TransactionItem as TransactionItemType } from "../types";

interface ShoppingCartItemProps {
  item: TransactionItemType;
}

export function TransactionItem({ item }: ShoppingCartItemProps) {
  return (
    <div className="p-3 space-y-3 border rounded-lg">
      <div className="flex items-end gap-3">
        <div className="relative overflow-hidden rounded shrink-0 size-11">
          {item.image ? (
            <Image src={item.image} alt={item.productName} fill className="object-cover" />
          ) : (
            <div className="grid place-content-center size-full bg-muted text-muted-foreground">
              <HugeiconsIcon icon={Image03Icon} size={16} strokeWidth={1.5} color="currentColor" />
            </div>
          )}
        </div>
        <div>
          <p className="font-medium line-clamp-1">
            {item.productName} ({item.quantity}&times;)
          </p>
          <p className="text-sm text-muted-foreground">{formatToIDR(item.priceAtSale)}</p>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Total Harga :</p>
        <p className="text-sm font-semibold">{formatToIDR(item.subtotal)}</p>
      </div>
    </div>
  );
}
