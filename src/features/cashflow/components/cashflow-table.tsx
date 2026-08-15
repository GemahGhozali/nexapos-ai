"use client";

import Link from "next/link";
import { cn } from "@/libs/shadcn";
import { format } from "date-fns";
import { formatToIDR } from "@/utils/format-to-idr";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@/components/ui/button";
import { useAllCashflows } from "../hooks";
import { CashflowTableEmpty } from "./cashflow-table-empty";
import { CashflowTableError } from "./cashflow-table-error";
import { CashflowTableSkeleton } from "./cashflow-table-skeleton";
import { PlusSignIcon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CashflowTableProps {
  title: string;
  description: string;
  showDataFromActiveShiftOnly: boolean;
}

export function CashflowTable({ title, description, showDataFromActiveShiftOnly }: CashflowTableProps) {
  const { data, isPending, isFetching, isError, error, refetch } = useAllCashflows({ showDataFromActiveShiftOnly });

  const currentPathName = usePathname();

  const renderTable = () => {
    if (isPending || isFetching) return <CashflowTableSkeleton />;

    if (isError) return <CashflowTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <CashflowTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipe Data</TableHead>
            <TableHead>Total Nominal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Metode Pembayaran</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cashflow) => (
            <TableRow key={cashflow.id}>
              <TableCell className="capitalize">
                <span className="flex items-center gap-1">
                  {cashflow.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  {cashflow.type === "income" ? (
                    <HugeiconsIcon icon={TradeUpIcon} size={18} className="text-green-600" strokeWidth={1.5} />
                  ) : (
                    <HugeiconsIcon icon={TradeDownIcon} size={18} className="text-red-600" strokeWidth={1.5} />
                  )}
                </span>
              </TableCell>
              <TableCell
                className={cn(
                  "font-semibold",
                  cashflow.type === "income" ? "text-green-600 before:content-['+_']" : "text-red-600 before:content-['-_']",
                )}
              >
                {formatToIDR(cashflow.amount)}
              </TableCell>
              <TableCell>{cashflow.category}</TableCell>
              <TableCell className="capitalize">{cashflow.paymentMethod === "cash" ? "Tunai" : "Transfer"}</TableCell>
              <TableCell>{format(cashflow.date, "dd/MM/yyyy")}</TableCell>
              <TableCell className={cn(!cashflow.description && "italic")}>{cashflow.description || "Tidak ada keterangan"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link href={`${currentPathName}/create`} className={buttonVariants({ variant: "default" })}>
            Tambah Mutasi Kas
            <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-end" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>{renderTable()}</CardContent>
    </Card>
  );
}
