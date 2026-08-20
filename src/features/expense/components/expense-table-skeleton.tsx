import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function ExpenseTableSkeleton() {
  return (
    <Table className="w-full">
      <TableBody>
        {Array.from({ length: 3 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="min-w-32">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-32">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-32">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-32">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
            <TableCell className="min-w-32">
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
