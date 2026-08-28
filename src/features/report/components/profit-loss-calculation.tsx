import { cn } from "@/libs/shadcn";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/utils/format-to-idr";
import { ExpenseDetails } from "./expense-details";
import { FinancialReport } from "../types";
import { ProfitLossIndicator } from "./profit-loss-indicator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfitLossCalucalationProps {
  data: FinancialReport;
}

export function ProfitLossCalucalation({ data }: ProfitLossCalucalationProps) {
  const isProfit = data.totalNetProfit > 0;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Perhitungan Laba/Rugi</CardTitle>
        <CardDescription>Rincian perhitungan laba/rugi dari awal hingga akhir</CardDescription>
      </CardHeader>
      <CardContent>
        <Card>
          <ProfitLossIndicator totalNetProfit={data.totalNetProfit} />
          <Separator />
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Omzet Transaksi</p>
              <p className={cn("font-medium", data.totalGrossSales > 0 && "text-green-600 before:content-['+_']")}>
                {formatToIDR(data.totalGrossSales)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Harga Pokok Produksi (HPP)</p>
              <p className={cn("font-medium", data.totalCogs > 0 && "text-red-600 before:content-['-_']")}>{formatToIDR(data.totalCogs)}</p>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Laba/Rugi Kotor</p>
              <p className="font-medium text-muted-foreground">{formatToIDR(data.totalGrossProfit)}</p>
            </div>
            <ExpenseDetails data={data} />
          </CardContent>
          <Separator />
          <CardFooter className="text-base justify-between">
            <p className="text-muted-foreground">Laba/Rugi Bersih</p>
            <p className={cn("font-medium", isProfit ? "before:content-['+_']" : "before:content-['-_']")}>
              {formatToIDR(Math.abs(data.totalNetProfit))}
            </p>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}
