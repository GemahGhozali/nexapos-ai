"use client";

import { format } from "date-fns";
import { AIWizard } from "@/features/ai/wizard/components/ai-wizard";
import { useState } from "react";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { ExpenseTableEmpty } from "./expense-table-empty";
import { ExpenseTableError } from "./expense-table-error";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { ExpenseTableSkeleton } from "./expense-table-skeleton";
import { CreditCardIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { useAllExpenses, useExpenseForm } from "../hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseTableProps {
  title: string;
  description: string;
  insertDataIntoActiveShift: boolean;
  showDataFromActiveShiftOnly: boolean;
}

export function ExpenseTable({ title, description, insertDataIntoActiveShift, showDataFromActiveShiftOnly }: ExpenseTableProps) {
  const { form, mutation } = useExpenseForm({ insertDataIntoActiveShift });

  const { data, isPending, isFetching, isError, error, refetch } = useAllExpenses({ showDataFromActiveShiftOnly });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
            {!showDataFromActiveShiftOnly && <TableHead>Penanggung Jawab</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{format(expense.date, "dd/MM/yyyy")}</TableCell>
              <TableCell className="font-medium text-red-600">- {formatToIDR(expense.amount)}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>
                {expense.paymentMethod === "cash" ? (
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
              <TableCell>{expense.description}</TableCell>
              {!showDataFromActiveShiftOnly && <TableCell>{expense.user.fullname}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <AIWizard
        placeholders={[
          "Belanja kebutuhan dapur 50 ribu pakai uang kas...",
          "Bayar ongkir kurir 10 ribu pakai E-Wallet...",
          "Re-stock bahan baku 25 ribu pakai QRIS...",
        ]}
        allowedTools={["create_expense"]}
        onGetResult={(response) => {
          if (response.data.action.name === "create_expense") {
            const expense = response.data.action.payload;
            setDialogOpen(true);
            form.setValues(expense);
          }
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <ExpenseFormDialog form={form} mutation={mutation} open={dialogOpen} setOpen={setDialogOpen} />
          </CardAction>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>
    </div>
  );
}
