import { cn } from "@/libs/shadcn";
import { Button } from "@/components/ui/button";
import { CartItem } from "../types";
import { useCartStore } from "../stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons";

interface QuantityChangerProps {
  item: CartItem;
  size?: "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  className?: string;
}

export function QuantityChanger({ item, size = "icon-sm", className }: QuantityChangerProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const isQuantityOne = item.quantity === 1;

  return (
    <div className={cn("flex items-center gap-2 p-1 rounded-full border bg-muted", className)}>
      <Button
        variant={isQuantityOne ? "destructive" : "outline"}
        size={size}
        className="rounded-full"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
      >
        {isQuantityOne ? (
          <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.5} color="currentColor" />
        ) : (
          <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={1.5} color="currentColor" />
        )}
      </Button>
      <span className="text-center font-semibold">{item.quantity}</span>
      <Button variant="default" size={size} className="rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
        <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} color="currentColor" />
      </Button>
    </div>
  );
}
