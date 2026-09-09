import { cn } from "@/libs/shadcn";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/utils/format-to-idr";
import { MinusSignCircleIcon, PlusSignCircleIcon, Wallet01Icon, CircleCheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShiftDetail } from "../types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ShiftDetailCashTrackerProps {
  data: ShiftDetail;
}

export function ShiftDetailCashTracker({ data }: ShiftDetailCashTrackerProps) {
  const estimatedCashInDrawer = data.openingCash + data.cashIncome - data.cashExpense;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kas Fisik Operasional</CardTitle>
        <CardDescription>Pantau kas fisik selama sesi operasional shift</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="justify-center text-center">
            {data.cashDifference === null && (
              <div className="mx-auto text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-3">
                <HugeiconsIcon icon={Wallet01Icon} size={24} color="currentColor" strokeWidth={1.5} />
              </div>
            )}
            {data.cashDifference !== null && data.cashDifference === 0 && (
              <div className="mx-auto text-green-600 bg-green-600/20 size-12 rounded-full grid place-content-center mb-3">
                <HugeiconsIcon icon={CircleCheckIcon} size={24} color="currentColor" strokeWidth={1.5} />
              </div>
            )}
            {data.cashDifference !== null && data.cashDifference < 0 && (
              <div className="mx-auto text-red-600 bg-red-600/20 size-12 rounded-full grid place-content-center mb-3">
                <HugeiconsIcon icon={MinusSignCircleIcon} size={24} color="currentColor" strokeWidth={1.5} />
              </div>
            )}
            {data.cashDifference !== null && data.cashDifference > 0 && (
              <div className="mx-auto text-green-600 bg-green-600/20 size-12 rounded-full grid place-content-center mb-3">
                <HugeiconsIcon icon={PlusSignCircleIcon} size={24} color="currentColor" strokeWidth={1.5} />
              </div>
            )}
            <CardDescription>
              {data.cashDifference === null && "Kas Fisik Yang Tercatat Saat Ini"}
              {data.cashDifference !== null && data.cashDifference === 0 && "Kas Fisik Yang Tercatat Sesuai Dengan Kas Yang Sebenarnya"}
              {data.cashDifference !== null && data.cashDifference < 0 && "Terdapat Selisih Kas Fisik (Kurang)"}
              {data.cashDifference !== null && data.cashDifference > 0 && "Terdapat Selisih Kas Fisik (Lebih)"}
            </CardDescription>
            <CardTitle
              className={cn(
                "text-2xl",
                data.cashDifference !== null && data.cashDifference < 0 && "before:content-['-_']",
                data.cashDifference !== null && data.cashDifference > 0 && "before:content-['+_']",
              )}
            >
              {data.cashDifference === null && formatToIDR(estimatedCashInDrawer)}
              {data.cashDifference !== null && data.cashDifference === 0 && "Tidak Ada Selisih Kas"}
              {data.cashDifference !== null && data.cashDifference !== 0 && formatToIDR(Math.abs(data.cashDifference))}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Modal Kas Fisik Awal</p>
              <p className="font-semibold text-muted-foreground">{formatToIDR(data.openingCash)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Total Kas Masuk</p>
              <p className={cn(data.cashIncome > 0 ? "text-green-600 before:content-['+_']" : "text-muted-foreground", "font-semibold")}>
                {formatToIDR(data.cashIncome)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Total Kas Keluar</p>
              <p className={cn(data.cashExpense > 0 ? "text-red-600 before:content-['-_']" : "text-muted-foreground", "font-semibold")}>
                {formatToIDR(data.cashExpense)}
              </p>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex-col gap-3">
            <div className="w-full flex justify-between items-center">
              <p className="text-muted-foreground">Kas Fisik Yang Tercatat</p>
              <p className="font-medium">{formatToIDR(estimatedCashInDrawer)}</p>
            </div>
            <div className="w-full flex justify-between items-center">
              <p className="text-muted-foreground">Kas Yang Sebenarnya</p>
              <p className={cn("font-medium", data.closingCash === null && "italic font-normal text-muted-foreground")}>
                {data.closingCash !== null ? formatToIDR(data.closingCash) : "Belum Tercatat"}
              </p>
            </div>
            <div className="w-full flex justify-between items-center">
              <p className="text-muted-foreground">Selisih Kas</p>
              <p
                className={cn(
                  "font-medium",
                  data.cashDifference === null && "italic font-normal text-muted-foreground",
                  data.cashDifference !== null && data.cashDifference < 0 && "text-red-600 before:content-['-_']",
                  data.cashDifference !== null && data.cashDifference > 0 && "text-green-600 before:content-['+_']",
                )}
              >
                {data.cashDifference !== null ? formatToIDR(Math.abs(data.cashDifference)) : "Belum Tercatat"}
              </p>
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}
