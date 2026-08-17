"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/utils/format-to-idr";
import { useCartStore } from "../stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCartItem } from "./shopping-cart-item";
import { CheckoutFormSheet } from "./checkout-form-sheet";
import { Cancel01Icon, Money04Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CartSheet() {
  const cart = useCartStore((state) => state.cart);
  const itemQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const [open, setOpen] = useState<boolean>(false);

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="icon-lg" variant={itemQuantity === 0 ? "secondary" : "default"} className="fixed bottom-6 right-6 z-50">
            {itemQuantity > 0 && <Badge className="absolute -top-2 -right-2 bg-red-700 px-1.25">{itemQuantity}</Badge>}
            <HugeiconsIcon icon={ShoppingCart01Icon} size={16} strokeWidth={2} color="currentColor" />
          </Button>
        }
      />
      <SheetContent showCloseButton={false}>
        <SheetHeader className="border-b p-4 flex-row justify-between items-center">
          <SheetTitle>Keranjang Belanja</SheetTitle>
          <SheetClose
            render={
              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
              </Button>
            }
          />
        </SheetHeader>
        {renderItems()}
        {itemQuantity > 0 && (
          <SheetFooter className="border-t p-4 gap-4">
            <div className="p-3 space-y-3 border rounded-lg bg-secondary">
              <p className="font-semibold text-base">Ringkasan Transaksi</p>
              <Separator />
              <div className="flex justify-between gap-3">
                <p className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={16} strokeWidth={2} color="currentColor" />
                  Total Item
                </p>
                <p className="font-medium">{itemQuantity} Item</p>
              </div>
              <div className="flex justify-between gap-3">
                <p className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={Money04Icon} size={16} strokeWidth={2} color="currentColor" />
                  Total Keseluruhan
                </p>
                <p className="font-medium">{formatToIDR(totalAmount)}</p>
              </div>
              <Separator />
              <CheckoutFormSheet onCheckoutSuccess={() => setOpen(false)} />
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
