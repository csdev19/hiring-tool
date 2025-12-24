import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiringProcessForm } from "@/components/hiring-process/hiring-process-form";
import {
  useHiringProcess,
  useUpdateHiringProcess,
  type Currency,
  type InterviewStatus,
} from "@/hooks/use-hiring-processes";
import {
  useCompanyDetails,
  useCreateCompanyDetails,
  useUpdateCompanyDetails,
} from "@/hooks/use-company-details";
import { toast } from "sonner";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/hiring-processes/$id_/edit")({
  component: EditHiringProcessPage,
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

function EditHiringProcessPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useHiringProcess(id);
  console.log("data", { data, isLoading, error });
  const { data: companyDetailsData, isLoading: isLoadingCompanyDetails } = useCompanyDetails(id);
  const updateMutation = useUpdateHiringProcess();
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
            hiringProcessId: id,
            data: companyDetails,
          });
        } else {
          // Create new company details
          await createCompanyDetailsMutation.mutateAsync({
            hiringProcessId: id,
            data: companyDetails,
          });
        }
      }

      toast.success("Hiring process updated successfully");
      navigate({ to: "/hiring-processes/$id", params: { id } });
    } catch (error) {
      toast.error("Failed to update hiring process");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/hiring-processes/$id", params: { id } });
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading hiring process: {error.message}</p>
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
            <p className="text-muted-foreground">Loading hiring process...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hiringProcess = data;

  if (!hiringProcess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Hiring process not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Hiring Process</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update hiring process details for {hiringProcess.companyName}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hiring Process Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HiringProcessForm
            initialValues={{
              companyName: hiringProcess.companyName,
              status: hiringProcess.status,
              salary: hiringProcess.salary || undefined,
              currency: hiringProcess.currency,
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
            submitLabel="Update Hiring Process"
          />
        </CardContent>
      </Card>
    </div>
  );
}
