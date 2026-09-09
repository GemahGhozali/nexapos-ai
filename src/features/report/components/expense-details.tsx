"use client";

import { cn } from "@/libs/shadcn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { FinancialReport } from "../types";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExpenseDetailsProps {
  data: FinancialReport;
}

export function ExpenseDetails({ data }: ExpenseDetailsProps) {
  if (data.totalExpenses === 0) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Pengeluaran Operasional</p>
        <p className="font-medium text-muted-foreground">{formatToIDR(data.totalExpenses)}</p>
      </div>
    );
  }

  return (
    <Collapsible className="space-y-4 text-sm">
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto rounded-none p-0 w-full gap-2 justify-start items-center bg-transparent! hover:bg-transparent! text-muted-foreground! hover:text-muted-foreground! font-normal"
          >
            Pengeluaran Operasional
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.5}
              className="group-data-panel-open/button:rotate-180"
            />
            <span className={cn("ml-auto font-medium text-foreground", data.totalExpenses > 0 && "text-red-600! before:content-['-_']")}>
              {formatToIDR(data.totalExpenses)}
            </span>
          </Button>
        }
      />
      <CollapsibleContent className="flex gap-4">
        <Separator orientation="vertical" />
        <ul className="w-full space-y-4 text-muted-foreground">
          {data.expensesByCategory.map((expense) => (
            <li key={expense.category} className="flex justify-between">
              <p>{expense.category}</p>
              <p className="font-medium"> {formatToIDR(expense.total)}</p>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
