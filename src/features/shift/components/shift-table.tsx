"use client";

import Link from "next/link";
import { cn } from "@/libs/shadcn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { formatToIDR } from "@/utils/format-to-idr";
import { useAllShifts } from "../hooks";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShiftTableEmpty } from "./shift-table-empty";
import { ShiftTableError } from "./shift-table-error";
import { ShiftTableSkeleton } from "./shift-table-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ShiftTable() {
  const { data, isPending, isFetching, isError, error, refetch } = useAllShifts();

  const renderTable = () => {
    if (isPending || isFetching) return <ShiftTableSkeleton />;

    if (isError) return <ShiftTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <ShiftTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal Buka</TableHead>
            <TableHead>Karyawan</TableHead>
            <TableHead>Status Shift</TableHead>
            <TableHead>Total Pemasukan</TableHead>
            <TableHead>Total Pengeluaran</TableHead>
            <TableHead>Selisih Kas</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell>{format(new Date(shift.openedAt), "dd/MM/yyyy")}</TableCell>
              <TableCell className="font-medium">{shift.userName}</TableCell>
              <TableCell>
                <Badge variant={shift.status === "open" ? "default" : "secondary"}>{shift.status === "open" ? "Buka" : "Tutup"}</Badge>
              </TableCell>
              <TableCell className={cn("font-medium", shift.totalIncome > 0 && "text-green-600 before:content-['+_']")}>
                {formatToIDR(shift.totalIncome)}
              </TableCell>
              <TableCell className={cn("font-medium", shift.totalExpense > 0 && "text-red-600 before:content-['-_']")}>
                {formatToIDR(shift.totalExpense)}
              </TableCell>
              <TableCell
                className={cn(
                  "font-medium",
                  shift.cashDifference === null && "italic",
                  shift.cashDifference !== null && shift.cashDifference < 0 && "text-red-600 before:content-['-_']",
                  shift.cashDifference !== null && shift.cashDifference > 0 && "text-green-600 before:content-['+_']",
                )}
              >
                {shift.cashDifference !== null ? formatToIDR(Math.abs(shift.cashDifference)) : "Belum Ada"}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/shift-operational-history/${shift.id}/detail`}>
                  <Button variant="outline" size="sm">
                    <HugeiconsIcon icon={ViewIcon} size={16} color="currentColor" strokeWidth={2} data-icon="inline-start" />
                    Lihat Detail
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Operasional Shift</CardTitle>
          <CardDescription>Semua riwayat operasional shift yang pernah dilakukan.</CardDescription>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>
    </div>
  );
}
