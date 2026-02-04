import { Card, CardContent, CardHeader, Skeleton } from "@interviews-tool/web-ui";

export function HiringProcessDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Main Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interaction Section Skeleton - Two columns */}
      <div className="mt-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] gap-6">
          {/* Left: Form skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>

          {/* Right: Timeline skeleton */}
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border/50" />
            <div className="space-y-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="relative pl-10">
                  <div className="absolute left-[13px] top-5 size-[7px] rounded-full bg-muted" />
                  <div className="rounded-lg py-3 px-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
