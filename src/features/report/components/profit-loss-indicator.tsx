import { cn } from "@/libs/shadcn";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Analytics01Icon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";

interface ProfitLossIndicatorProps {
  totalNetProfit: number;
}

export function ProfitLossIndicator({ totalNetProfit }: ProfitLossIndicatorProps) {
  const isProfit = totalNetProfit > 0;
  const isEven = totalNetProfit === 0;

  return (
    <CardHeader className="text-center justify-center">
      <div
        className={cn(
          "mx-auto size-12 rounded-full grid place-content-center mb-3",
          isEven && "bg-muted text-muted-foreground",
          isProfit ? "bg-green-600/20 text-green-600" : "bg-red-600/20 text-red-600",
        )}
      >
        <HugeiconsIcon icon={isEven ? Analytics01Icon : isProfit ? TradeUpIcon : TradeDownIcon} size={24} color="currentColor" strokeWidth={1.5} />
      </div>
      <CardDescription>
        {isEven ? "Anda belum mendapatkan keuntungan" : isProfit ? "Anda mendapatkan profit sebesar" : "Anda mengalami kerugian sebesar"}
      </CardDescription>
      <CardTitle className={cn("text-2xl", isProfit ? "before:content-['+_']" : "before:content-['-_']")}>
        {formatToIDR(Math.abs(totalNetProfit))}
      </CardTitle>
    </CardHeader>
  );
}
