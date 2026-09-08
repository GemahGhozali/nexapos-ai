import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";

interface ShiftTableErrorProps {
  error: Error;
  refetch: () => void;
}

export function ShiftTableError({ error, refetch }: ShiftTableErrorProps) {
  return (
    <div className="py-8 px-4 border border-dashed rounded-lg flex flex-col justify-center items-center text-center">
      <div className="bg-destructive/10 text-destructive size-12 rounded-full grid place-content-center mb-3">
        <HugeiconsIcon icon={CancelCircleIcon} size={24} color="currentColor" strokeWidth={1.75} />
      </div>
      <p className="font-semibold text-foreground">{error.message}</p>
      <p className="text-muted-foreground text-sm">Terjadi kesalahan, silahkan coba lagi.</p>
      <Button variant="secondary" className="mt-3" onClick={() => refetch()}>
        Coba Lagi
      </Button>
    </div>
  );
}
