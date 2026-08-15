"use client";

import { Store02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { OpenShiftFormDialog } from "./open-shift-form-dialog";
import { useSelectedLayoutSegment } from "next/navigation";

interface ShiftGatewayProps {
  hasActiveShift: boolean;
  children: React.ReactNode;
}

export const ShiftGateway = ({ hasActiveShift, children }: ShiftGatewayProps) => {
  const currentSegment = useSelectedLayoutSegment();

  const userAccessingOperationalRoutes = currentSegment === "(operational)" || currentSegment === null;

  if (!hasActiveShift && userAccessingOperationalRoutes) {
    return (
      <div className="p-4 border rounded-lg flex items-center gap-4">
        <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center">
          <HugeiconsIcon icon={Store02Icon} size={24} color="currentColor" strokeWidth={1.75} />
        </div>
        <div className="space-x-1">
          <p className="font-semibold text-foreground font-heading">Anda belum membuka shift</p>
          <p className="text-muted-foreground text-sm">Silahkan membuka shift terlebih dahulu untuk memulai operasional</p>
        </div>
        <div className="ml-auto">
          <OpenShiftFormDialog />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
