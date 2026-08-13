import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";

interface CashierCatalogErrorProps {
  error?: Error | null;
  refetch: () => void;
}

export function CashierCatalogError({ error, refetch }: CashierCatalogErrorProps) {
  return (
    <div className="p-4 bg-muted border rounded-lg flex items-center gap-4">
      <div className="bg-destructive/10 text-destructive size-12 rounded-full grid place-content-center">
        <HugeiconsIcon icon={CancelCircleIcon} size={24} color="currentColor" strokeWidth={1.75} />
      </div>
      <div className="space-x-1">
        <p className="font-semibold text-foreground font-heading">{error?.message}</p>
        <p className="text-muted-foreground">Terjadi kesalahan saat memuat data produk dan kategori, silahkan coba lagi.</p>
      </div>
      <Button variant="outline" className="ml-auto" onClick={() => refetch()}>
        Coba Lagi
      </Button>
    </div>
  );
}
