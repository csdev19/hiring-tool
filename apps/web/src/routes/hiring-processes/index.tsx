import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@interviews-tool/web-ui";
import { InterviewTable } from "@/components/hiring-process/hiring-process-table";
import { useHiringProcesses, useDeleteHiringProcess } from "@/hooks/use-hiring-processes";
import { getUser } from "@/functions/get-user";
import { Plus } from "lucide-react";
import { TestComponent } from "@interviews-tool/web-ui";

export const Route = createFileRoute("/hiring-processes/")({
  component: HiringProcessesComponent,
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
});

function HiringProcessesComponent() {
  const { data: hiringProcessesData, isLoading, error } = useHiringProcesses();
  const deleteHiringProcess = useDeleteHiringProcess();

  const handleDelete = async (id: string) => {
    await deleteHiringProcess.mutateAsync(id);
  };

  const hiringProcesses = hiringProcessesData?.data || [];

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
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading hiring processes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>Error loading hiring processes: {error.message}</p>
            </div>
          ) : (
            <InterviewTable
              interviews={hiringProcesses}
              onDelete={handleDelete}
              isDeleting={deleteHiringProcess.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
