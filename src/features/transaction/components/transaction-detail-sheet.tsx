"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "../types";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TransactionItem } from "./transaction-item";
import { TransactionSummary } from "./transaction-summary";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface TransactionDetailsSheetProps {
  transaction?: Transaction;
  onClose: () => void;
}

export function TransactionDetailSheet({ transaction, onClose }: TransactionDetailsSheetProps) {
  return (
    <Sheet
      open={Boolean(transaction)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent showCloseButton={false}>
        {transaction && (
          <>
            <SheetHeader className="border-b p-4 flex-row justify-between items-center">
              <SheetTitle>Detail Transaksi</SheetTitle>
              <SheetClose
                render={
                  <Button variant="ghost" size="icon-sm">
                    <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
                  </Button>
                }
              />
            </SheetHeader>
            <div className="p-4 space-y-4">
              {transaction.items.map((item) => (
                <TransactionItem key={item.id} item={item} />
              ))}
            </div>
            <SheetFooter>
              <TransactionSummary transaction={transaction} />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
