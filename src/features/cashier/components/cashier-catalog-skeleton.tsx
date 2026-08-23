import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function CashierCatalogSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-14 rounded-full" />
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="relative pt-0 pb-4 gap-4">
            <Skeleton className="aspect-square rounded-none" />
            <CardHeader className="px-4">
              <CardTitle>
                <Skeleton className="w-full h-6" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="w-2/4 h-5" />
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-4">
              <Skeleton className="w-full h-10" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
