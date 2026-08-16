import { cn } from "@/libs/shadcn";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { Cashflow } from "../types";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCardIcon, TradeDownIcon, TradeUpIcon, Wallet01Icon } from "@hugeicons/core-free-icons";

interface DeleteProductDialogProps {
  cashflow?: Cashflow;
  onClose: () => void;
}

export function CashflowDetailDialog({ cashflow, onClose }: DeleteProductDialogProps) {
  return (
    <Dialog
      open={Boolean(cashflow)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Detail Mutasi Kas</DialogTitle>
        </DialogHeader>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Tanggal</p>
            <p>{cashflow?.date ? format(cashflow.date, "d MMMM yyyy, HH:mm", { locale: id }) : "--:--"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Penanggung Jawab</p>
            <p className={cn(!cashflow?.user && "italic")}>{cashflow?.user?.fullname || "Tidak ada"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Kategori</p>
            <p>{cashflow?.category || "--:--"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Total Nominal</p>
            <p>{cashflow?.amount ? formatToIDR(cashflow.amount) : "--:--"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Tipe Data</p>
            <p className="flex items-center gap-1">
              {!cashflow?.type ? (
                "--:--"
              ) : cashflow.type === "income" ? (
                <>
                  Pemasukan
                  <HugeiconsIcon icon={TradeUpIcon} size={18} className="text-green-600" strokeWidth={1.5} />
                </>
              ) : (
                <>
                  Pengeluaran
                  <HugeiconsIcon icon={TradeDownIcon} size={18} className="text-red-600" strokeWidth={1.5} />
                </>
              )}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Metode Pembayaran</p>
            <p className="flex items-center gap-2">
              {!cashflow?.paymentMethod ? (
                "--:--"
              ) : cashflow.paymentMethod === "cash" ? (
                <>
                  <HugeiconsIcon icon={Wallet01Icon} size={18} strokeWidth={1.5} />
                  Tunai
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={CreditCardIcon} size={18} strokeWidth={1.5} />
                  Transfer
                </>
              )}
            </p>
          </div>
          <div className="space-y-2 col-span-2">
            <p className="text-muted-foreground text-sm">Keterangan</p>
            <p className={cn(!cashflow?.description && "italic")}>{cashflow?.description || "Tidak ada deskripsi"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
