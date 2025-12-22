import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewForm } from "@/components/interviews/interview-form";
import { useInterview, useUpdateInterview } from "@/hooks/use-interviews";
import { toast } from "sonner";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/interviews/$id_/edit")({
  component: EditInterviewPage,
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

function EditInterviewPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useInterview(id);
  const updateMutation = useUpdateInterview();

  const handleSubmit = async (
    formData: Parameters<typeof updateMutation.mutateAsync>[0]["data"],
  ) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Interview updated successfully");
      navigate({ to: "/interviews/$id", params: { id } });
    } catch (error) {
      toast.error("Failed to update interview");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/interviews", params: { id } });
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading interview: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading interview...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const interview = data?.data;

  if (!interview) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Interview not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Interview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update interview details for {interview.companyName}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InterviewForm
            initialValues={{
              companyName: interview.companyName,
              status: interview.status,
              salary: interview.salary || undefined,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update Interview"
          />
        </CardContent>
      </Card>
    </div>
  );
}
