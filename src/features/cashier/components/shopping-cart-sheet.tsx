import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCartItem } from "./shopping-cart-item";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CartSheet() {
  const cart = useCartStore((state) => state.cart);
  const itemQuantity = useCartStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));

  const renderItems = () => {
    if (itemQuantity === 0) {
      return (
        <div className="grow flex flex-col justify-center items-center">
          <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center mb-3">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={24} color="currentColor" strokeWidth={1.75} />
          </div>
          <p className="font-semibold text-foreground">Keranjang belanja kosong</p>
          <p className="text-muted-foreground text-sm">Silahkan tambahkan produk terlebih dahulu</p>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto p-4 space-y-4 scrollbar-none">
        {cart.map((item) => (
          <ShoppingCartItem key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size="icon-lg" variant={itemQuantity === 0 ? "secondary" : "default"} className="fixed bottom-6 right-6 z-50">
            {itemQuantity > 0 && <Badge className="absolute -top-2 -right-2 bg-red-700 px-1.25">{itemQuantity}</Badge>}
            <HugeiconsIcon icon={ShoppingCart01Icon} size={16} strokeWidth={2} color="currentColor" />
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader className="border-b p-4">
          <SheetTitle>Keranjang Belanja</SheetTitle>
          <SheetDescription>Daftar item yang dimasukkan ke keranjang</SheetDescription>
        </SheetHeader>
        {renderItems()}
        <SheetFooter className="border-t p-4">
          <Button disabled={itemQuantity === 0}>Checkout Pemesanan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
