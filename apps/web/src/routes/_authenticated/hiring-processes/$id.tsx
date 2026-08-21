import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button, Skeleton, StatusBadge, cn } from "@interviews-tool/web-ui";
import { useFormatter, useTranslations } from "@interviews-tool/i18n";
import { CURRENCY_INFO, SALARY_RATE_TYPES } from "@interviews-tool/domain/constants";
import type { Currency, SalaryRateType } from "@interviews-tool/domain/constants";

import { DeleteConfirmDialog } from "@/components/hiring-process/delete-confirm-dialog";
import { InteractionTimeline } from "@/components/interaction/interaction-timeline";
import { InteractionForm } from "@/components/interaction/interaction-form";
import { EditInteractionDialog } from "@/components/interaction/edit-interaction-dialog";
import { DeleteInteractionDialog } from "@/components/interaction/delete-interaction-dialog";
import { useHiringProcess, useDeleteHiringProcess } from "@/hooks/use-hiring-processes";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { useInteractions, type Interaction } from "@/hooks/use-interactions";
import { useStatusLabel } from "@/lib/i18n-labels";

export const Route = createFileRoute("/_authenticated/hiring-processes/$id")({
  component: HiringProcessDetailPage,
});

const STICKY_THRESHOLD = 240;

function useStickyHeader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > STICKY_THRESHOLD;
      setVisible((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}

function useSalaryParts() {
  const t = useTranslations("processForm");
  const format = useFormatter();

  return (salary: number | null, currency: Currency, rateType?: SalaryRateType | null) => {
    if (!salary) return null;
    const symbol = CURRENCY_INFO[currency]?.symbol ?? "$";
    const rate =
      rateType === SALARY_RATE_TYPES.HOURLY
        ? { long: t("perHour"), short: t("perHourShort") }
        : { long: t("perMonth"), short: t("perMonthShort") };
    return { amount: `${symbol}${format.number(salary)}`, rate, currency };
  };
}

function HiringProcessDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const t = useTranslations("process");
  const format = useFormatter();
  const statusLabel = useStatusLabel();
  const salaryParts = useSalaryParts();

  const { data: hiringProcess, isLoading, error, refetch } = useHiringProcess(id);
  const { data: companyDetailsData } = useCompanyDetails(id);
  const { data: interactionsData } = useInteractions(id);
  const deleteMutation = useDeleteHiringProcess();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [deletingInteractionId, setDeletingInteractionId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showStickyHeader = useStickyHeader();

  const interactionCount = interactionsData?.data?.length ?? 0;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("deletedToast"));
      navigate({ to: "/hiring-processes" });
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <main className="mx-auto max-w-[1200px] px-8 pb-24 pt-7">
        <BackLink />
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-medium text-text">{t("loadErrorTitle")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("loadErrorBody")}</p>
          <Button variant="secondary" className="mt-4" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        </div>
      </main>
    );
  }

  if (!isLoading && !hiringProcess) {
    return (
      <main className="mx-auto max-w-[1200px] px-8 pb-24 pt-7">
        <BackLink />
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-medium text-text">{t("notFoundTitle")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("notFoundBody")}</p>
          <Link to="/hiring-processes" className="mt-4 inline-block">
            <Button variant="secondary">{t("backToProcesses")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const salary = hiringProcess
    ? salaryParts(
        hiringProcess.salary,
        hiringProcess.currency,
        hiringProcess.salaryRateType as SalaryRateType | undefined,
      )
    : null;

  const companyDetails = companyDetailsData?.data;
  const detailFields = companyDetails
    ? ([
        ["website", companyDetails.website],
        ["location", companyDetails.location],
        ["contactedVia", companyDetails.contactedVia],
        ["contactPerson", companyDetails.contactPerson],
        ["interviewSteps", companyDetails.interviewSteps],
        ["benefits", companyDetails.benefits],
      ] as const)
    : [];
  const hasDetails = detailFields.some(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  return (
    <>
      {/* Sticky contextual header */}
      {hiringProcess && (
        <div
          className={cn(
            "fixed inset-x-0 top-0 z-40 h-[52px] border-b border-border bg-bg/80 backdrop-blur-[12px] transition-all duration-200",
            showStickyHeader
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0",
          )}
        >
          <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="truncate text-sm font-medium text-text">
                {hiringProcess.companyName}
              </span>
              {hiringProcess.jobTitle && (
                <span className="truncate text-[13px] text-text-secondary">
                  {hiringProcess.jobTitle}
                </span>
              )}
              <StatusBadge
                status={hiringProcess.status}
                label={statusLabel(hiringProcess.status)}
              />
              {salary && (
                <span className="mono hidden text-[13px] text-text-secondary md:inline">
                  {salary.amount} {salary.rate.short} · {salary.currency}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link to="/hiring-processes/$id/edit" params={{ id }}>
                <Button variant="ghost" className="h-[30px] px-2.5 text-[13px]">
                  {t("edit")}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="h-[30px] px-2.5 text-[13px] hover:bg-[#2E1414] hover:text-danger"
                onClick={() => setShowDeleteDialog(true)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1200px] px-8 pb-24 pt-7">
        <BackLink />

        {/* Process card */}
        {isLoading || !hiringProcess ? (
          <ProcessCardSkeleton />
        ) : (
          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[32px] font-medium leading-tight tracking-[-0.01em] text-text">
                  {hiringProcess.companyName}
                </h1>
                {hiringProcess.jobTitle && (
                  <p className="mt-1 text-sm text-text-secondary">{hiringProcess.jobTitle}</p>
                )}
                <div className="mt-3">
                  <StatusBadge
                    status={hiringProcess.status}
                    label={statusLabel(hiringProcess.status)}
                  />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Link to="/hiring-processes/$id/edit" params={{ id }}>
                  <Button variant="ghost" className="h-8">
                    {t("edit")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="h-8 hover:bg-[#2E1414] hover:text-danger"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  {t("delete")}
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-6 lg:grid-cols-4">
              <div>
                <FieldLabel>{t("salary")}</FieldLabel>
                {salary ? (
                  <>
                    <p className="mono text-2xl text-text">{salary.amount}</p>
                    <p className="mono mt-0.5 text-xs text-text-secondary">
                      {salary.rate.long} · {salary.currency}
                    </p>
                  </>
                ) : (
                  <p className="mono text-2xl text-text-muted">—</p>
                )}
              </div>
              <div>
                <FieldLabel>{t("interactions")}</FieldLabel>
                <p className="mono text-2xl text-text">{format.number(interactionCount)}</p>
                <p className="mono mt-0.5 text-xs text-text-secondary">{t("logged")}</p>
              </div>
              <DateField label={t("created")} date={hiringProcess.createdAt} />
              <DateField label={t("lastUpdated")} date={hiringProcess.updatedAt} />
            </div>

            {hasDetails && (
              <div className="mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setDetailsOpen((open) => !open)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-text">{t("companyDetails")}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-text-muted transition-transform",
                      detailsOpen && "rotate-180",
                    )}
                  />
                </button>
                {detailsOpen && companyDetails && (
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    {companyDetails.website && (
                      <div>
                        <FieldLabel>{t("website")}</FieldLabel>
                        <a
                          href={
                            companyDetails.website.startsWith("http")
                              ? companyDetails.website
                              : `https://${companyDetails.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-mint hover:underline"
                        >
                          {companyDetails.website}
                        </a>
                      </div>
                    )}
                    {companyDetails.location && (
                      <div>
                        <FieldLabel>{t("location")}</FieldLabel>
                        <p className="text-sm text-text">{companyDetails.location}</p>
                      </div>
                    )}
                    {companyDetails.contactedVia && (
                      <div>
                        <FieldLabel>{t("contactedVia")}</FieldLabel>
                        <p className="text-sm text-text">{companyDetails.contactedVia}</p>
                      </div>
                    )}
                    {companyDetails.contactPerson && (
                      <div>
                        <FieldLabel>{t("contactPerson")}</FieldLabel>
                        <p className="text-sm text-text">{companyDetails.contactPerson}</p>
                      </div>
                    )}
                    {companyDetails.interviewSteps !== null &&
                      companyDetails.interviewSteps !== undefined && (
                        <div>
                          <FieldLabel>{t("interviewSteps")}</FieldLabel>
                          <p className="mono text-sm text-text">{companyDetails.interviewSteps}</p>
                        </div>
                      )}
                    {companyDetails.benefits && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <FieldLabel>{t("benefits")}</FieldLabel>
                        <p className="whitespace-pre-wrap text-sm text-text">
                          {companyDetails.benefits}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Interactions */}
        <h2 className="mb-5 mt-11 text-2xl font-medium text-text">{t("interactions")}</h2>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[360px_1fr]">
          <div className="lg:sticky lg:top-20">
            <InteractionForm hiringProcessId={id} />
          </div>
          <InteractionTimeline
            hiringProcessId={id}
            onEdit={(interaction) => setEditingInteraction(interaction)}
            onDelete={(interaction) => setDeletingInteractionId(interaction.id)}
          />
        </div>
      </main>

      {showDeleteDialog && hiringProcess && (
        <DeleteConfirmDialog
          companyName={hiringProcess.companyName}
          interactionCount={interactionCount}
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
    </>
  );
}

function BackLink() {
  const t = useTranslations("process");
  return (
    <Link
      to="/hiring-processes"
      className="mb-6 inline-flex items-center gap-2 text-[13px] text-text-secondary transition-colors hover:text-text"
    >
      <ArrowLeft className="size-3.5" />
      {t("backToProcesses")}
    </Link>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-medium tracking-[0.04em] text-text-muted">{children}</p>
  );
}

function DateField({ label, date }: { label: string; date: Date }) {
  const format = useFormatter();
  const value = new Date(date);
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="mono text-[13px] leading-relaxed text-text-secondary">
        {format.dateTime(value, { month: "short", day: "numeric", year: "numeric" })}
        <br />
        {format.dateTime(value, { hour: "numeric", minute: "2-digit" })}
      </p>
    </div>
  );
}

function ProcessCardSkeleton() {
  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <Skeleton className="h-8 w-64 bg-surface-2" />
      <Skeleton className="mt-2 h-4 w-40 bg-surface-2" />
      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16 bg-surface-2" />
            <Skeleton className="mt-2 h-7 w-24 bg-surface-2" />
          </div>
        ))}
      </div>
    </section>
  );
}
