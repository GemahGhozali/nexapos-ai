import { PackageIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ProductTableEmpty() {
  return (
    <div className="py-12 px-4 border border-dashed rounded-lg flex flex-col justify-center items-center text-center">
      <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center mb-3">
        <HugeiconsIcon icon={PackageIcon} size={24} color="currentColor" strokeWidth={1.75} />
      </div>
      <p className="font-semibold text-foreground">There are no products</p>
      <p className="text-muted-foreground text-sm">All your products will be displayed here.</p>
    </div>
  );
}
