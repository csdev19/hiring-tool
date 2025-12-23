import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewForm } from "@/components/interviews/interview-form";
import { useInterview, useUpdateInterview } from "@/hooks/use-interviews";
import {
  useCompanyDetails,
  useCreateCompanyDetails,
  useUpdateCompanyDetails,
} from "@/hooks/use-company-details";
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
  const { data: companyDetailsData, isLoading: isLoadingCompanyDetails } = useCompanyDetails(id);
  const updateMutation = useUpdateInterview();
  const createCompanyDetailsMutation = useCreateCompanyDetails();
  const updateCompanyDetailsMutation = useUpdateCompanyDetails();

  const handleSubmit = async (
    formData: Parameters<typeof updateMutation.mutateAsync>[0]["data"],
    companyDetails?: Parameters<typeof updateCompanyDetailsMutation.mutateAsync>[0]["data"],
  ) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });

      // Handle company details
      if (companyDetails) {
        if (companyDetailsData?.data) {
          // Update existing company details
          await updateCompanyDetailsMutation.mutateAsync({
            interviewId: id,
            data: companyDetails,
          });
        } else {
          // Create new company details
          await createCompanyDetailsMutation.mutateAsync({
            interviewId: id,
            data: companyDetails,
          });
        }
      }

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

  if (isLoading || isLoadingCompanyDetails) {
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
              currency: interview.currency,
            }}
            initialCompanyDetails={
              companyDetailsData?.data
                ? {
                    website: companyDetailsData.data.website || undefined,
                    location: companyDetailsData.data.location || undefined,
                    benefits: companyDetailsData.data.benefits || undefined,
                    contactedVia: companyDetailsData.data.contactedVia || undefined,
                    contactPerson: companyDetailsData.data.contactPerson || undefined,
                    interviewSteps: companyDetailsData.data.interviewSteps || undefined,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={
              updateMutation.isPending ||
              updateCompanyDetailsMutation.isPending ||
              createCompanyDetailsMutation.isPending
            }
            submitLabel="Update Interview"
          />
        </CardContent>
      </Card>
    </div>
  );
}
