import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from "@interviews-tool/web-ui";
import {
  HIRING_PROCESS_STATUS_VALUES,
  HIRING_PROCESS_STATUS_INFO,
  type HiringProcessStatus,
} from "@interviews-tool/domain/constants";
import { InterviewTable } from "@/components/hiring-process/hiring-process-table";
import { StatusBadge } from "@/components/hiring-process/status-badge";
import { HiringProcessTableSkeleton } from "@/components/hiring-process/hiring-process-table-skeleton";
import {
  useHiringProcesses,
  useDeleteHiringProcess,
  hiringProcessesQueryOptions,
  type FilterParams,
} from "@/hooks/use-hiring-processes";
import { Plus, Filter, X } from "lucide-react";
import { useState, useCallback } from "react";

export const Route = createFileRoute("/_authenticated/hiring-processes/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(hiringProcessesQueryOptions({ page: 1, limit: 5 })),
  component: HiringProcessesComponent,
});

function HiringProcessesComponent() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [filters, setFilters] = useState<FilterParams>({});

  const hasActiveFilters =
    (filters.statuses && filters.statuses.length > 0) ||
    filters.salaryDeclared !== undefined ||
    filters.salaryMin !== undefined ||
    filters.salaryMax !== undefined;

  const updateFilters = useCallback((update: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...update }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const {
    data: hiringProcessesData,
    isLoading,
    error,
  } = useHiringProcesses({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    filters: hasActiveFilters ? filters : undefined,
  });

  const deleteHiringProcess = useDeleteHiringProcess();

  const handleDelete = async (id: string) => {
    await deleteHiringProcess.mutateAsync(id);
  };

  const toggleStatus = useCallback(
    (status: HiringProcessStatus) => {
      const current = filters.statuses || [];
      const next = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
      updateFilters({ statuses: next.length > 0 ? next : undefined });
    },
    [filters.statuses, updateFilters],
  );

  const hiringProcesses = hiringProcessesData?.data || [];
  const paginationMeta = hiringProcessesData?.meta?.pagination;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Job Applications</h1>
          <p className="text-muted-foreground mt-1">Manage your job applications</p>
        </div>
        <Link to="/hiring-processes/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Create Job Application
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Hiring Processes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-3">
            {/* Status multi-select */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger className="border-input dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-8 min-w-32 items-center gap-1.5 rounded-md border bg-transparent px-2.5 text-xs transition-colors focus-visible:ring-1">
                  <Filter className="size-3.5 shrink-0" />
                  {filters.statuses && filters.statuses.length > 0 ? (
                    <span className="flex flex-1 flex-wrap items-center gap-1">
                      {filters.statuses.slice(0, 3).map((status) => (
                        <StatusBadge key={status} status={status} />
                      ))}
                      {filters.statuses.length > 3 && (
                        <span className="text-muted-foreground text-xs">
                          +{filters.statuses.length - 3}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">All statuses</span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {HIRING_PROCESS_STATUS_VALUES.map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={filters.statuses?.includes(status) ?? false}
                        onCheckedChange={() => toggleStatus(status)}
                      >
                        {HIRING_PROCESS_STATUS_INFO[status].label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Salary declared filter */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Salary</Label>
              <Select
                value={
                  filters.salaryDeclared === undefined
                    ? "all"
                    : filters.salaryDeclared
                      ? "declared"
                      : "not-declared"
                }
                onValueChange={(value) => {
                  if (!value || value === "all") {
                    updateFilters({
                      salaryDeclared: undefined,
                      salaryMin: undefined,
                      salaryMax: undefined,
                    });
                  } else {
                    updateFilters({
                      salaryDeclared: value === "declared",
                      ...(value === "not-declared"
                        ? { salaryMin: undefined, salaryMax: undefined }
                        : {}),
                    });
                  }
                }}
              >
                <SelectTrigger className="h-8 w-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="declared">Declared</SelectItem>
                  <SelectItem value="not-declared">Not declared</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary range (only when salaryDeclared === true) */}
            {filters.salaryDeclared === true && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Min salary</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min"
                    className="h-8 w-28"
                    value={filters.salaryMin ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFilters({
                        salaryMin: val ? Number(val) : undefined,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Max salary</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max"
                    className="h-8 w-28"
                    value={filters.salaryMax ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFilters({
                        salaryMax: val ? Number(val) : undefined,
                      });
                    }}
                  />
                </div>
              </>
            )}

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-8" onClick={clearFilters}>
                <X className="mr-1 size-3.5" />
                Clear filters
              </Button>
            )}
          </div>

          {isLoading ? (
            <HiringProcessTableSkeleton />
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>Error loading hiring processes: {error.message}</p>
            </div>
          ) : (
            <InterviewTable
              interviews={hiringProcesses}
              onDelete={handleDelete}
              isDeleting={deleteHiringProcess.isPending}
              pagination={pagination}
              onPaginationChange={setPagination}
              totalCount={paginationMeta?.total || 0}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
