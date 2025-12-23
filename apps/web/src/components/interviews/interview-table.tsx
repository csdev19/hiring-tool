import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import type { Interview } from "@/hooks/use-interviews";
import type { Currency } from "@interviews-tool/domain/constants";
import { Pencil, Trash2, Eye } from "lucide-react";

interface InterviewTableProps {
  interviews: Interview[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function InterviewTable({ interviews, onDelete, isDeleting = false }: InterviewTableProps) {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"updatedAt" | "companyName" | "salary">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const interviewToDelete = interviews.find((i) => i.id === deleteId);

  const sortedInterviews = [...interviews].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "updatedAt") {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortBy === "companyName") {
      comparison = a.companyName.localeCompare(b.companyName);
    } else if (sortBy === "salary") {
      comparison = (a.salary || 0) - (b.salary || 0);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSalary = (salary: number | null, currency: Currency = "USD") => {
    if (!salary) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(salary);
  };

  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No interviews yet. Create your first interview to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2 font-medium">
                <button
                  onClick={() => handleSort("companyName")}
                  className="hover:text-foreground flex items-center gap-1"
                >
                  Company
                  {sortBy === "companyName" && (
                    <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>
              <th className="text-left p-2 font-medium">Status</th>
              <th className="text-left p-2 font-medium">
                <button
                  onClick={() => handleSort("salary")}
                  className="hover:text-foreground flex items-center gap-1"
                >
                  Salary
                  {sortBy === "salary" && (
                    <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>
              <th className="text-left p-2 font-medium">
                <button
                  onClick={() => handleSort("updatedAt")}
                  className="hover:text-foreground flex items-center gap-1"
                >
                  Last Update
                  {sortBy === "updatedAt" && (
                    <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>
              <th className="text-right p-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInterviews.map((interview) => (
              <tr key={interview.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-2">
                  <Link
                    to="/interviews/$id"
                    params={{ id: interview.id }}
                    className="font-medium hover:underline"
                  >
                    {interview.companyName}
                  </Link>
                </td>
                <td className="p-2">
                  <StatusBadge status={interview.status} />
                </td>
                <td className="p-2">{formatSalary(interview.salary, interview.currency)}</td>
                <td className="p-2 text-muted-foreground">{formatDate(interview.updatedAt)}</td>
                <td className="p-2">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      title="View"
                      onClick={() =>
                        navigate({ to: "/interviews/$id", params: { id: interview.id } })
                      }
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      title="Edit"
                      onClick={() =>
                        navigate({ to: "/interviews/$id/edit", params: { id: interview.id } })
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
