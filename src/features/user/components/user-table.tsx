"use client";

import { User } from "../types";
import { useState } from "react";
import { useAllUsers } from "../hooks";
import { HugeiconsIcon } from "@hugeicons/react";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HashtagIcon, PencilEdit02Icon, Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteUserDialog from "./delete-user-dialog";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function UserTable() {
  const { data, isPending, isFetching, isError, error } = useAllUsers();

  const [selectedUser, setSelectedUser] = useState<Omit<User, "password"> | null>(null);

  const renderTable = () => {
    if (isPending || isFetching) {
      return (
        <div className="space-y-4">
          <Skeleton className="w-full h-24" />
        </div>
      );
    }

    if (isError) return <p>{error.message}</p>;

    if (data.length === 0) return <p>No user data currently</p>;

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
          <CardTitle>User Data</CardTitle>
          <CardDescription>See all user accounts here.</CardDescription>
          <CardAction>
            <Link href="/dashboard/user/create" className={buttonVariants({ variant: "default" })}>
              Add User
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
