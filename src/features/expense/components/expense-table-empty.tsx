import { HugeiconsIcon } from "@hugeicons/react";
import { ReverseWithdrawal01Icon } from "@hugeicons/core-free-icons";

export function ExpenseTableEmpty() {
  return (
    <div className="py-12 px-4 border border-dashed rounded-lg flex flex-col justify-center items-center text-center">
      <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center mb-3">
        <HugeiconsIcon icon={ReverseWithdrawal01Icon} size={24} color="currentColor" strokeWidth={1.75} />
      </div>
      <p className="font-semibold text-foreground">Tidak ada mutasi kas apapun</p>
      <p className="text-muted-foreground text-sm">Semua riwayat mutasi akan terlihat disini.</p>
    </div>
  );
}
