"use client";

import Link from "next/link";
import { format } from "date-fns";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@/components/ui/button";
import { useAllExpenses } from "../hooks";
import { ExpenseTableEmpty } from "./expense-table-empty";
import { ExpenseTableError } from "./expense-table-error";
import { ExpenseTableSkeleton } from "./expense-table-skeleton";
import { CreditCardIcon, PlusSignIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ExpenseTable() {
  const { data, isPending, isFetching, isError, error, refetch } = useAllExpenses();

  const renderTable = () => {
    if (isPending || isFetching) return <ExpenseTableSkeleton />;

    if (isError) return <ExpenseTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <ExpenseTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Total Pengeluaran</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Metode Pembayaran</TableHead>
            <TableHead>Deskripsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cashflow) => (
            <TableRow key={cashflow.id}>
              <TableCell>{format(cashflow.date, "dd/MM/yyyy")}</TableCell>
              <TableCell className="font-medium text-red-600">- {formatToIDR(cashflow.amount)}</TableCell>
              <TableCell>{cashflow.category}</TableCell>
              <TableCell>
                {cashflow.paymentMethod === "cash" ? (
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon icon={Wallet01Icon} size={18} strokeWidth={1.5} />
                    Tunai
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon icon={CreditCardIcon} size={18} strokeWidth={1.5} />
                    Transfer
                  </p>
                )}
              </TableCell>
              <TableCell>{cashflow.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengeluaran Shift</CardTitle>
        <CardDescription>Riwayat pengeluaran selama sesi shift berlangsung.</CardDescription>
        <CardAction>
          <Link href="expense/create" className={buttonVariants({ variant: "default" })}>
            Tambah Pengeluaran
            <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-end" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>{renderTable()}</CardContent>
    </Card>
  );
}
