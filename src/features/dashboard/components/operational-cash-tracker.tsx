import { cn } from "@/libs/shadcn";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/utils/format-to-idr";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CashDrawerDetails } from "../queries";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface OperationalCashTrackerProps {
  data: CashDrawerDetails;
}

export function OperationalCashTracker({ data }: OperationalCashTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kas Fisik Operasional</CardTitle>
        <CardDescription>Pantau kas fisik yang anda miliki dengan kas yang tercatat oleh sistem</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="justify-center text-center">
            <div className="mx-auto text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-3">
              <HugeiconsIcon icon={Wallet01Icon} size={24} color="currentColor" strokeWidth={1.5} />
            </div>
            <CardDescription>Kas Fisik Yang Tercatat Oleh Sistem</CardDescription>
            <CardTitle className="text-2xl">{formatToIDR(data.estimatedCashInDrawer)}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Modal Kas Fisik Awal</p>
              <p className="font-semibold text-muted-foreground">{formatToIDR(data.startingCash)}</p>
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
          <CardFooter>
            <div className="w-full flex justify-between items-center text-base">
              <p className="text-muted-foreground">Total Kas Fisik Tercatat</p>
              <p className="font-semibold">{formatToIDR(data.estimatedCashInDrawer)}</p>
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}
