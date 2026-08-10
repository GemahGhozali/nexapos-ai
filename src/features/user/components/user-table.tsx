"use client";

import Link from "next/link";
import { User } from "../types";
import { useState } from "react";
import { useAllUsers } from "../hooks";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserTableError } from "./user-table-error";
import { UserTableEmpty } from "./user-table-empty";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UserTableSkeleton } from "./user-table-skeleton";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HashtagIcon, PencilEdit02Icon, Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserTable() {
  const { data, isPending, isFetching, isError, error, refetch } = useAllUsers();

  const [selectedUser, setSelectedUser] = useState<Omit<User, "password"> | null>(null);

  const renderTable = () => {
    if (isPending || isFetching) return <UserTableSkeleton />;

    if (isError) return <UserTableError error={error} refetch={refetch} />;

    if (data.length === 0) return <UserTableEmpty />;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <HugeiconsIcon icon={HashtagIcon} size={16} color="currentColor" strokeWidth={1.5} className="mx-auto" />
            </TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="w-10">
                <Avatar size="lg">
                  <AvatarImage src={user.profileImage || ""} alt={user.fullname} />
                  <AvatarFallback className="font-semibold">{generateNameInitials(user.fullname)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.fullname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/dashboard/user/${user.id}/update`} className={buttonVariants({ variant: "outline", size: "icon" })}>
                  <HugeiconsIcon icon={PencilEdit02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </Link>
                <Button variant="outline" size="icon" onClick={() => setSelectedUser(user)}>
                  <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Pengguna</CardTitle>
          <CardDescription>Daftar semua akun pengguna di dalam aplikasi</CardDescription>
          <CardAction>
            <Link href="/dashboard/user/create" className={buttonVariants({ variant: "default" })}>
              Tambah Pengguna
              <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" strokeWidth={1.5} data-icon="inline-end" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>
      <DeleteUserDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}
