import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ShiftOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="w-full flex justify-between items-end gap-6">
        <div className="grow space-y-2.5">
          <Skeleton className="h-7 w-1/4 rounded-lg" />
          <Skeleton className="h-3.5 w-2/4 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
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
      <div className="grid grid-cols-2 gap-6 h-[505px]">
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
      <Card className="w-full h-[374px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-1/4 h-8 rounded-lg" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="w-2/4 h-5 rounded-lg" />
          </CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <Skeleton className="size-full" />
        </CardContent>
      </Card>
    </div>
  );
}
