"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreditCardIcon, ViewIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { Transaction } from "../types";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAllTransactions } from "../hooks";
import { TransactionTableEmpty } from "./transaction-table-empty";
import { TransactionTableError } from "./transaction-table-error";
import { TransactionDetailSheet } from "./transaction-detail-sheet";
import { TransactionTableSkeleton } from "./transaction-table-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionTable() {
  const { data, isPending, isFetching, isError, error, refetch } = useAllTransactions();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  const renderTable = () => {
    if (isPending || isFetching) return <TransactionTableSkeleton />;

    if (isError) return <TransactionTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <TransactionTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal Transaksi</TableHead>
            <TableHead>Total Keseluruhan</TableHead>
            <TableHead>Metode Pembayaran</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => {
            const totalItem = transaction.items.reduce((total, item) => total + item.quantity, 0);

            return (
              <TableRow key={transaction.id}>
                <TableCell>{format(transaction.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>{formatToIDR(transaction.totalAmount)}</TableCell>
                <TableCell>
                  {transaction.paymentMethod === "cash" ? (
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
                <TableCell>{totalItem} Item</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                    <HugeiconsIcon icon={ViewIcon} size={16} color="currentColor" strokeWidth={2} data-icon="inline-start" />
                    Lihat Detail
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>Pantau semua transaksi selama sesi operasional shift.</CardDescription>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>
      <TransactionDetailSheet transaction={selectedTransaction} onClose={() => setSelectedTransaction(undefined)} />
    </>
  );
}
