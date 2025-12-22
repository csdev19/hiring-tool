import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewTable } from "@/components/interviews/interview-table";
import { useInterviews, useDeleteInterview } from "@/hooks/use-interviews";
import { getUser } from "@/functions/get-user";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/interviews/")({
  component: InterviewsComponent,
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

function InterviewsComponent() {
  const { data: interviewsData, isLoading, error } = useInterviews();
  const deleteInterview = useDeleteInterview();

  const handleDelete = async (id: string) => {
    await deleteInterview.mutateAsync(id);
  };

  const interviews = interviewsData?.data || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">Manage your job interview applications</p>
        </div>
        <Link to="/interviews/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Create Interview
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading interviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>Error loading interviews: {error.message}</p>
            </div>
          ) : (
            <InterviewTable
              interviews={interviews}
              onDelete={handleDelete}
              isDeleting={deleteInterview.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
