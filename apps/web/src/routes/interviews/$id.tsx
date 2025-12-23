import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/interviews/status-badge";
import { DeleteConfirmDialog } from "@/components/interviews/delete-confirm-dialog";
import { useInterview, useDeleteInterview } from "@/hooks/use-interviews";
import { useCompanyDetails } from "@/hooks/use-company-details";
import type { Currency } from "@interviews-tool/domain/constants";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Building2,
  User,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/interviews/$id")({
  component: InterviewDetailPage,
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

function InterviewDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useInterview(id);
  const { data: companyDetailsData, isLoading: isLoadingCompanyDetails } = useCompanyDetails(id);
  const deleteMutation = useDeleteInterview();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Interview deleted successfully");
      navigate({ to: "/interviews" });
    } catch (error) {
      toast.error("Failed to delete interview");
      console.error(error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading interview: {error.message}</p>
            <Link to="/interviews" className="mt-4 inline-block">
              <Button variant="outline">Back to Interviews</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || isLoadingCompanyDetails) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
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
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Interview not found</p>
            <Link to="/interviews" className="mt-4 inline-block">
              <Button variant="outline">Back to Interviews</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSalary = (salary: number | null, currency: Currency = "USD") => {
    if (!salary) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const isValidUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const companyDetails = companyDetailsData?.data;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link to="/interviews">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back to Interview
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{interview.companyName}</CardTitle>
              <div className="mt-2">
                <StatusBadge status={interview.status} />
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/interviews/$id/edit" params={{ id }}>
                <Button size="sm" variant="outline">
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h3>
                <p className="text-sm">{interview.companyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <StatusBadge status={interview.status} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Salary</h3>
                <p className="text-sm">{formatSalary(interview.salary, interview.currency)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <p className="text-sm">{formatDate(interview.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                <p className="text-sm">{formatDate(interview.updatedAt)}</p>
              </div>
            </div>

            {/* Company Details Section */}
            {companyDetails && (
              <>
                <div className="border-t pt-4 mt-2">
                  <h3 className="text-sm font-semibold mb-4">Company Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {companyDetails.website && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <Building2 className="size-3" />
                          Website
                        </h4>
                        {isValidUrl(companyDetails.website) ? (
                          <a
                            href={companyDetails.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {companyDetails.website}
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <p className="text-sm">{companyDetails.website}</p>
                        )}
                      </div>
                    )}

                    {companyDetails.location && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <MapPin className="size-3" />
                          Location
                        </h4>
                        <p className="text-sm">{companyDetails.location}</p>
                      </div>
                    )}

                    {companyDetails.contactedVia && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          Contacted Via
                        </h4>
                        <p className="text-sm">{companyDetails.contactedVia}</p>
                      </div>
                    )}

                    {companyDetails.contactPerson && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <User className="size-3" />
                          Contact Person
                        </h4>
                        <p className="text-sm">{companyDetails.contactPerson}</p>
                      </div>
                    )}

                    {companyDetails.interviewSteps !== null &&
                      companyDetails.interviewSteps !== undefined && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">
                            Interview Steps
                          </h4>
                          <p className="text-sm">{companyDetails.interviewSteps}</p>
                        </div>
                      )}
                  </div>

                  {companyDetails.benefits && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Benefits</h4>
                      <p className="text-sm whitespace-pre-wrap">{companyDetails.benefits}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {showDeleteDialog && (
        <DeleteConfirmDialog
          companyName={interview.companyName}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
