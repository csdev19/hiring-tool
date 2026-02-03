import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { Button } from "@interviews-tool/web-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@interviews-tool/web-ui";
import { StatusBadge } from "./status-badge";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import type { HiringProcess } from "@/hooks/use-hiring-processes";
import type { Currency, SalaryRateType } from "@interviews-tool/domain/constants";
import { SALARY_RATE_TYPE_LABELS } from "@interviews-tool/domain/constants";
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const columnHelper = createColumnHelper<HiringProcess>();

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSalary = (
  salary: number | null,
  currency: Currency = "USD",
  salaryRateType?: SalaryRateType,
) => {
  if (!salary) return "-";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(salary);
  const rateTypeLabel = salaryRateType ? SALARY_RATE_TYPE_LABELS[salaryRateType] : undefined;
  return rateTypeLabel ? `${formatted}/${rateTypeLabel.toLowerCase()}` : `${formatted} ${currency}`;
};

interface InterviewTableProps {
  interviews: HiringProcess[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  totalCount: number;
  isLoading?: boolean;
}

export function InterviewTable({
  interviews,
  onDelete,
  isDeleting = false,
  pagination,
  onPaginationChange,
  totalCount,
  isLoading = false,
}: InterviewTableProps) {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);

  const interviewToDelete = interviews.find((i) => i.id === deleteId);

  // Calculate page count based on server total
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  const columns = useMemo(
    () => [
      columnHelper.accessor("companyName", {
        header: "Company",
        cell: (info) => {
          const interview = info.row.original;
          return (
            <Link
              to="/hiring-processes/$id"
              params={{ id: interview.id }}
              className="font-medium hover:underline truncate block max-w-[200px]"
              title={info.getValue()}
            >
              {info.getValue()}
            </Link>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor("jobTitle", {
        header: "Job Title",
        cell: (info) => {
          const jobTitle = info.getValue();
          return jobTitle ? (
            <span className="text-muted-foreground truncate block max-w-[300px]" title={jobTitle}>
              {jobTitle}
            </span>
          ) : (
            <span className="text-muted-foreground italic">-</span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
        enableSorting: false,
      }),
      columnHelper.accessor("salary", {
        header: "Salary",
        cell: (info) => {
          const interview = info.row.original;
          return formatSalary(
            info.getValue(),
            interview.currency,
            interview.salaryRateType as SalaryRateType | undefined,
          );
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const salaryA = rowA.original.salary || 0;
          const salaryB = rowB.original.salary || 0;
          return salaryA - salaryB;
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: "Last Update",
        cell: (info) => (
          <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
        ),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.updatedAt).getTime();
          const dateB = new Date(rowB.original.updatedAt).getTime();
          return dateA - dateB;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const interview = info.row.original;
          return (
            <div className="flex justify-end gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                title="View"
                onClick={() =>
                  navigate({ to: "/hiring-processes/$id", params: { id: interview.id } })
                }
              >
                <Eye className="size-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                title="Edit"
                onClick={() =>
                  navigate({
                    to: "/hiring-processes/$id/edit",
                    params: { id: interview.id },
                  })
                }
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setDeleteId(interview.id)}
                title="Delete"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
      }),
    ],
    [navigate],
  );

  const table = useReactTable({
    data: interviews,
    columns,
    pageCount, // Tell the table how many pages there are based on server data
    manualPagination: true, // This tells the table to use server-side pagination
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      // Handle both direct state updates and updater functions
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      onPaginationChange(newPagination);
    },
    state: {
      sorting,
      pagination,
    },
  });

  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No interviews yet. Create your first interview to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const isActionsColumn = header.column.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isActionsColumn ? "text-right p-2 font-medium" : "text-left p-2 font-medium"
                      }
                    >
                      {canSort ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:text-foreground flex items-center gap-1"
                        >
                          {header.isPlaceholder
                            ? null
                            : typeof header.column.columnDef.header === "function"
                              ? header.column.columnDef.header(header.getContext())
                              : header.column.columnDef.header}
                          {isSorted && (
                            <span className="text-xs">{isSorted === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      ) : header.isPlaceholder ? null : typeof header.column.columnDef.header ===
                        "function" ? (
                        header.column.columnDef.header(header.getContext())
                      ) : (
                        header.column.columnDef.header
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-border hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => {
                  const isActionsColumn = cell.column.id === "actions";
                  return (
                    <TableCell key={cell.id} className={isActionsColumn ? "p-2 text-right" : "p-2"}>
                      {typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {totalCount === 0 ? (
                "No entries"
              ) : (
                <>
                  Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
                  {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of{" "}
                  {totalCount} {totalCount === 1 ? "entry" : "entries"}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="flex h-8 w-20 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {[5, 10, 20, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                title="First page"
              >
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                title="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="flex items-center gap-1 px-2 text-sm">
                <span className="text-muted-foreground">Page</span>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                title="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                title="Last page"
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {deleteId && interviewToDelete && (
        <DeleteConfirmDialog
          companyName={interviewToDelete.companyName}
          onConfirm={() => {
            onDelete(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
