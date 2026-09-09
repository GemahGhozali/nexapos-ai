import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ShiftDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grow space-y-3">
        <Skeleton className="h-7 w-1/4 rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 h-[180px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="size-12 rounded-full mb-4" />
              <CardDescription>
                <Skeleton className="w-2/4 h-5 rounded-lg" />
              </CardDescription>
              <CardTitle>
                <Skeleton className="w-3/4 h-8 rounded-lg" />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 h-[565px]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="w-2/4 h-8 rounded-lg" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="w-3/4 h-5 rounded-lg" />
              </CardDescription>
            </CardHeader>
            <CardContent className="size-full">
              <Skeleton className="size-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
