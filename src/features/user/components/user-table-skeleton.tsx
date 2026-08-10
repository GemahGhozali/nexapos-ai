import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function UserTableSkeleton() {
  return (
    <Table className="w-full">
      <TableBody>
        {Array.from({ length: 3 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="w-9">
              <Skeleton className="size-9 rounded-full" />
            </TableCell>
            <TableCell className="min-w-50">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-50">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-50">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-10">
              <div className="flex gap-2">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="size-9 rounded-full" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
