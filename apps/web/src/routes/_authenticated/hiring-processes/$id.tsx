import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@interviews-tool/web-ui";
import { StatusBadge } from "@/components/hiring-process/status-badge";
import { DeleteConfirmDialog } from "@/components/hiring-process/delete-confirm-dialog";
import { HiringProcessDetailSkeleton } from "@/components/hiring-process/hiring-process-detail-skeleton";
import { useHiringProcess, useDeleteHiringProcess } from "@/hooks/use-hiring-processes";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { InteractionTimeline } from "@/components/interaction/interaction-timeline";
import { InteractionForm } from "@/components/interaction/interaction-form";
import { EditInteractionDialog } from "@/components/interaction/edit-interaction-dialog";
import { DeleteInteractionDialog } from "@/components/interaction/delete-interaction-dialog";
import type { Interaction } from "@/hooks/use-interactions";
import type { Currency, SalaryRateType } from "@interviews-tool/domain/constants";
import { SALARY_RATE_TYPE_LABELS } from "@interviews-tool/domain/constants";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Building2,
  User,
  MessageSquare,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hiring-processes/$id")({
  component: HiringProcessDetailPage,
});

function HiringProcessDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useHiringProcess(id);
  const { data: companyDetailsData, isLoading: isLoadingCompanyDetails } = useCompanyDetails(id);
  const deleteMutation = useDeleteHiringProcess();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [deletingInteractionId, setDeletingInteractionId] = useState<string | null>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );

    if (headerCardRef.current) {
      observer.observe(headerCardRef.current);
    }

    return () => observer.disconnect();
  }, [data]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Hiring process deleted successfully");
      navigate({ to: "/hiring-processes" });
    } catch (error) {
      toast.error("Failed to delete hiring process");
      console.error(error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading hiring process: {error.message}</p>
            <Link to="/hiring-processes" className="mt-4 inline-block">
              <Button variant="outline">Back to Hiring Processes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || isLoadingCompanyDetails) {
    return <HiringProcessDetailSkeleton />;
  }

  const hiringProcess = data;

  if (!hiringProcess) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Hiring process not found</p>
            <Link to="/hiring-processes" className="mt-4 inline-block">
              <Button variant="outline">Back to Hiring Processes</Button>
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

  const formatSalary = (
    salary: number | null,
    currency: Currency = "USD",
    salaryRateType?: SalaryRateType,
  ) => {
    if (!salary) return "Not specified";
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(salary);
    const rateTypeLabel = salaryRateType ? SALARY_RATE_TYPE_LABELS[salaryRateType] : undefined;
    return rateTypeLabel ? `${formatted}/${rateTypeLabel.toLowerCase()}` : formatted;
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
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Sticky contextual header */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
          showStickyHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/hiring-processes">
                <Button variant="ghost" size="icon-sm" className="shrink-0">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-sm truncate">{hiringProcess.companyName}</span>
                {hiringProcess.jobTitle && (
                  <>
                    <span className="text-muted-foreground text-xs hidden sm:inline">/</span>
                    <span className="text-muted-foreground text-xs truncate hidden sm:inline">
                      {hiringProcess.jobTitle}
                    </span>
                  </>
                )}
              </div>
              <StatusBadge status={hiringProcess.status} />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
                <DollarSign className="size-3" />
                {formatSalary(
                  hiringProcess.salary,
                  hiringProcess.currency,
                  hiringProcess.salaryRateType as SalaryRateType | undefined,
                )}
              </span>
              <div className="flex gap-1">
                <Link to="/hiring-processes/$id/edit" params={{ id }}>
                  <Button size="icon-sm" variant="ghost">
                    <Pencil className="size-3.5" />
                  </Button>
                </Link>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mb-6">
        <Link to="/hiring-processes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back to Hiring Processes
          </Button>
        </Link>
      </div>

      {/* Core Information Card */}
      <Card ref={headerCardRef}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{hiringProcess.companyName}</CardTitle>
              {hiringProcess.jobTitle && (
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Briefcase className="size-3.5" />
                  {hiringProcess.jobTitle}
                </p>
              )}
              <div className="mt-2">
                <StatusBadge status={hiringProcess.status} />
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/hiring-processes/$id/edit" params={{ id }}>
                <Button size="sm" variant="ghost">
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteDialog(true)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Salary</h3>
              <p className="text-sm font-medium">
                {formatSalary(
                  hiringProcess.salary,
                  hiringProcess.currency,
                  hiringProcess.salaryRateType as SalaryRateType | undefined,
                )}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Status</h3>
              <StatusBadge status={hiringProcess.status} />
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Created</h3>
              <p className="text-sm">{formatDate(hiringProcess.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-1">Last Updated</h3>
              <p className="text-sm">{formatDate(hiringProcess.updatedAt)}</p>
            </div>
          </div>

          {/* Complementary Information Section */}
          {companyDetails && (
            <div className="mt-6">
              <Accordion>
                <AccordionItem value="company-info">
                  <AccordionTrigger>
                    <h3 className="text-sm font-semibold">Complementary Information</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interaction Section: Two-column layout */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Interaction History</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] gap-6">
          {/* Left column: Sticky interaction form */}
          <div className="lg:self-start lg:sticky lg:top-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">New Interaction</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractionForm hiringProcessId={id} />
              </CardContent>
            </Card>
          </div>

          {/* Right column: Timeline */}
          <div className="min-h-[50vh]">
            <InteractionTimeline
              hiringProcessId={id}
              onEdit={(interaction) => setEditingInteraction(interaction)}
              onDelete={(interaction) => setDeletingInteractionId(interaction.id)}
            />
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteConfirmDialog
          companyName={hiringProcess.companyName}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {editingInteraction && (
        <EditInteractionDialog
          interaction={editingInteraction}
          hiringProcessId={id}
          open={!!editingInteraction}
          onOpenChange={(open) => !open && setEditingInteraction(null)}
        />
      )}

      {deletingInteractionId && (
        <DeleteInteractionDialog
          interactionId={deletingInteractionId}
          hiringProcessId={id}
          open={!!deletingInteractionId}
          onOpenChange={(open) => !open && setDeletingInteractionId(null)}
        />
      )}
    </div>
  );
}
