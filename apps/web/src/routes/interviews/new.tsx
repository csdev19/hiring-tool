import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewForm } from "@/components/interviews/interview-form";
import { useCreateInterview } from "@/hooks/use-interviews";
import { useCreateCompanyDetails } from "@/hooks/use-company-details";
import { toast } from "sonner";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/interviews/new")({
  component: NewInterviewPage,
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

function NewInterviewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateInterview();
  const createCompanyDetailsMutation = useCreateCompanyDetails();

  const handleSubmit = async (
    data: Parameters<typeof createMutation.mutateAsync>[0],
    companyDetails?: Parameters<typeof createCompanyDetailsMutation.mutateAsync>[0]["data"],
  ) => {
    try {
      const interview = await createMutation.mutateAsync(data);
      const interviewId = interview.id;

      // Create company details if provided
      if (companyDetails) {
        try {
          await createCompanyDetailsMutation.mutateAsync({
            interviewId,
            data: companyDetails,
          });
        } catch (error) {
          console.error("Failed to create company details:", error);
          // Don't fail the whole operation if company details fail
        }
      }

      toast.success("Interview created successfully");
      navigate({ to: "/interviews" });
    } catch (error) {
      toast.error("Failed to create interview");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/interviews" });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Interview</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new job interview to track</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InterviewForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending || createCompanyDetailsMutation.isPending}
            submitLabel="Create Interview"
          />
        </CardContent>
      </Card>
    </div>
  );
}
