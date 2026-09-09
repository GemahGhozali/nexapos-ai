import { format } from "date-fns";
import { ShiftDetail } from "../types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClipboardClockIcon, Clock01Icon, User03Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";

interface ShiftDetailHeaderProps {
  data: ShiftDetail;
}

export function ShiftDetailHeader({ data }: ShiftDetailHeaderProps) {
  return (
    <>
      <header className="space-y-3">
        <h1 className="text-xl font-medium">Detail Shift</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <div className="px-3 py-1.5 flex items-center gap-2 bg-card w-fit rounded-full border">
            <div className={`size-2 rounded-full shrink-0 ${data.status === "open" ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
            <p className="text-sm font-medium text-muted-foreground">Status : {data.status === "open" ? "Buka" : "Tutup"}</p>
          </div>
          <div className="px-3 py-1.5 flex items-center gap-1.5 bg-card w-fit rounded-full border">
            <HugeiconsIcon icon={User03Icon} size={14} strokeWidth={2} />
            <p className="text-sm font-medium text-muted-foreground">Karyawan : {data.userName}</p>
          </div>
          <div className="px-3 py-1.5 flex items-center gap-1.5 bg-card w-fit rounded-full border">
            <HugeiconsIcon icon={ClipboardClockIcon} size={14} strokeWidth={2} />
            <p className="text-sm font-medium text-muted-foreground">Dibuka : {format(new Date(data.openedAt), "dd/MM/yyyy, HH:mm")}</p>
          </div>
          {data.closedAt && (
            <div className="px-3 py-1.5 flex items-center gap-1.5 bg-card w-fit rounded-full border">
              <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={2} />
              <p className="text-sm font-medium text-muted-foreground">Ditutup : {format(new Date(data.closedAt), "dd/MM/yyyy, HH:mm")}</p>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
