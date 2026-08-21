import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  Textarea,
  cn,
} from "@interviews-tool/web-ui";
import { useTranslations } from "@interviews-tool/i18n";
import {
  CURRENCIES,
  CURRENCY_INFO,
  CURRENCY_VALUES,
  DEFAULT_HIRING_PROCESS_STATUS,
  SALARY_RATE_TYPES,
  type Currency,
  type HiringProcessStatus,
  type SalaryRateType,
} from "@interviews-tool/domain/constants";
import type { CreateHiringProcessInput } from "@/hooks/use-hiring-processes";
import type { CreateCompanyDetailsInput } from "@/hooks/use-company-details";
import { useStatusLabel } from "@/lib/i18n-labels";

const SALARY_MAX = 25000;

/* Pipeline order for the status select (the domain constant orders terminal
   statuses differently; the pipeline reads better in the picker). */
const PIPELINE_STATUSES: HiringProcessStatus[] = [
  "first-contact",
  "ongoing",
  "on-hold",
  "offer-made",
  "offer-accepted",
  "hired",
  "rejected",
  "dropped-out",
];

const CONTACTED_VIA_VALUES = ["LinkedIn", "Email", "Facebook", "Other"] as const;

interface HiringProcessFormProps {
  initialValues?: Partial<CreateHiringProcessInput>;
  initialCompanyDetails?: Partial<CreateCompanyDetailsInput>;
  onSubmit: (data: CreateHiringProcessInput, companyDetails?: CreateCompanyDetailsInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

function isValidWebsite(value: string): boolean {
  try {
    new URL(value.startsWith("http") ? value : `https://${value}`);
    return value.includes(".");
  } catch {
    return false;
  }
}

export function HiringProcessForm({
  initialValues,
  initialCompanyDetails,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode,
}: HiringProcessFormProps) {
  const t = useTranslations("processForm");
  const statusLabel = useStatusLabel();

  const hasInitialDetails = Boolean(
    initialCompanyDetails &&
    Object.values(initialCompanyDetails).some((v) => v !== undefined && v !== "" && v !== null),
  );
  const [showCompanyDetails, setShowCompanyDetails] = useState(hasInitialDetails);

  const form = useForm({
    defaultValues: {
      companyName: initialValues?.companyName ?? "",
      jobTitle: initialValues?.jobTitle ?? "",
      status: initialValues?.status ?? DEFAULT_HIRING_PROCESS_STATUS,
      salary: initialValues?.salary as number | undefined,
      currency: initialValues?.currency ?? CURRENCIES.USD,
      salaryRateType: initialValues?.salaryRateType ?? SALARY_RATE_TYPES.MONTHLY,
      website: initialCompanyDetails?.website ?? "",
      location: initialCompanyDetails?.location ?? "",
      contactedVia: initialCompanyDetails?.contactedVia ?? "",
      contactPerson: initialCompanyDetails?.contactPerson ?? "",
      interviewSteps: initialCompanyDetails?.interviewSteps as number | undefined,
      benefits: initialCompanyDetails?.benefits ?? "",
    },
    onSubmit: async ({ value }) => {
      const companyDetails: CreateCompanyDetailsInput = {
        website: value.website || undefined,
        location: value.location || undefined,
        contactedVia: value.contactedVia || undefined,
        contactPerson: value.contactPerson || undefined,
        interviewSteps: value.interviewSteps || undefined,
        benefits: value.benefits || undefined,
      };
      const hasDetails = Object.values(companyDetails).some((v) => v !== undefined);

      onSubmit(
        {
          companyName: value.companyName,
          jobTitle: value.jobTitle || undefined,
          status: value.status,
          salary: value.salary,
          currency: value.currency,
          salaryRateType: value.salaryRateType,
        },
        hasDetails ? companyDetails : undefined,
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid gap-7"
    >
      {/* Company name — the only required field, and it shows */}
      <form.Field
        name="companyName"
        validators={{
          onSubmit: ({ value }) => (!value.trim() ? t("companyNameRequired") : undefined),
        }}
      >
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="companyName">{t("companyName")}</Label>
            <Input
              id="companyName"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={t("companyPlaceholder")}
              disabled={isSubmitting}
              className={cn(
                "h-[52px] text-xl",
                field.state.meta.errors.length > 0 && "border-danger",
              )}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-danger">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Job title | Status with live badge */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-[1fr_220px] sm:gap-6">
        <form.Field name="jobTitle">
          {(field) => (
            <div className="grid content-start gap-2">
              <Label htmlFor="jobTitle">{t("jobTitle")}</Label>
              <Input
                id="jobTitle"
                className="h-9"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t("jobTitlePlaceholder")}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => (
            <div className="grid content-start gap-2">
              <Label htmlFor="status">{t("status")}</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as HiringProcessStatus)}
              >
                <SelectTrigger id="status" className="h-9 w-full" disabled={isSubmitting}>
                  <SelectValue>{statusLabel(field.state.value)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <StatusBadge status={field.state.value} label={statusLabel(field.state.value)} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Salary — "Numbers, not vibes" */}
      <form.Field
        name="salary"
        validators={{
          onSubmit: ({ value }) =>
            value !== undefined && value > SALARY_MAX ? t("salaryMaxError") : undefined,
        }}
      >
        {(salaryField) => (
          <form.Field name="salaryRateType">
            {(rateField) => (
              <form.Field name="currency">
                {(currencyField) => (
                  <div className="grid gap-2">
                    <Label htmlFor="salary">
                      {rateField.state.value === SALARY_RATE_TYPES.HOURLY
                        ? t("hourlyRate")
                        : t("monthlySalary")}
                    </Label>
                    <div className="flex h-11 max-w-[420px] items-stretch divide-x divide-border overflow-hidden rounded-md border border-border bg-surface-2 transition-colors focus-within:[box-shadow:var(--focus-ring)] hover:border-border-strong">
                      <span className="mono flex w-12 shrink-0 items-center justify-center text-base text-text-muted">
                        {CURRENCY_INFO[currencyField.state.value]?.symbol ?? "$"}
                      </span>
                      <input
                        id="salary"
                        type="number"
                        min={0}
                        max={SALARY_MAX}
                        value={salaryField.state.value ?? ""}
                        onChange={(e) =>
                          salaryField.handleChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        placeholder={t("salaryPlaceholder")}
                        disabled={isSubmitting}
                        className="mono min-w-0 flex-1 bg-transparent px-3 text-lg text-text outline-none [appearance:textfield] focus-visible:shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <Select
                        value={rateField.state.value}
                        onValueChange={(value) => rateField.handleChange(value as SalaryRateType)}
                      >
                        <SelectTrigger
                          className="h-full shrink-0 rounded-none border-0 bg-transparent text-text-secondary focus-visible:shadow-none"
                          disabled={isSubmitting}
                        >
                          <SelectValue>
                            {rateField.state.value === SALARY_RATE_TYPES.HOURLY
                              ? t("perHour")
                              : t("perMonth")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SALARY_RATE_TYPES.MONTHLY}>{t("perMonth")}</SelectItem>
                          <SelectItem value={SALARY_RATE_TYPES.HOURLY}>{t("perHour")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={currencyField.state.value}
                        onValueChange={(value) => currencyField.handleChange(value as Currency)}
                      >
                        <SelectTrigger
                          className="h-full shrink-0 rounded-none border-0 bg-transparent text-text-secondary focus-visible:shadow-none"
                          disabled={isSubmitting}
                        >
                          <SelectValue>{currencyField.state.value}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_VALUES.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {salaryField.state.meta.errors.length > 0 && (
                      <p className="text-xs text-danger">{salaryField.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              </form.Field>
            )}
          </form.Field>
        )}
      </form.Field>

      {/* Company details — collapsible */}
      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setShowCompanyDetails((open) => !open)}
          className="flex w-full items-center justify-between text-left"
          disabled={isSubmitting}
        >
          <span className="text-sm font-medium text-text">{t("companyDetails")}</span>
          <ChevronDown
            className={cn(
              "size-4 text-text-muted transition-transform",
              showCompanyDetails && "rotate-180",
            )}
          />
        </button>

        {showCompanyDetails && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field
              name="website"
              validators={{
                onSubmit: ({ value }) =>
                  value && !isValidWebsite(value) ? t("websiteInvalid") : undefined,
              }}
            >
              {(field) => (
                <div className="grid content-start gap-2">
                  <Label htmlFor="website">{t("website")}</Label>
                  <Input
                    id="website"
                    className="h-9"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("websitePlaceholder")}
                    disabled={isSubmitting}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-danger">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="location">
              {(field) => (
                <div className="grid content-start gap-2">
                  <Label htmlFor="location">{t("location")}</Label>
                  <Input
                    id="location"
                    className="h-9"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("locationPlaceholder")}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="contactedVia">
              {(field) => (
                <div className="grid content-start gap-2">
                  <Label htmlFor="contactedVia">{t("contactedVia")}</Label>
                  <Select
                    value={field.state.value || undefined}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger id="contactedVia" className="h-9 w-full" disabled={isSubmitting}>
                      <SelectValue>
                        {field.state.value ? (
                          field.state.value === "Other" ? (
                            t("otherOption")
                          ) : (
                            field.state.value
                          )
                        ) : (
                          <span className="text-text-muted">{t("contactedViaPlaceholder")}</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACTED_VIA_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value === "Other" ? t("otherOption") : value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="contactPerson">
              {(field) => (
                <div className="grid content-start gap-2">
                  <Label htmlFor="contactPerson">{t("contactPerson")}</Label>
                  <Input
                    id="contactPerson"
                    className="h-9"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("contactPersonPlaceholder")}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="interviewSteps"
              validators={{
                onSubmit: ({ value }) =>
                  value !== undefined && (!Number.isInteger(value) || value < 0)
                    ? t("interviewStepsInvalid")
                    : undefined,
              }}
            >
              {(field) => (
                <div className="grid content-start gap-2">
                  <Label htmlFor="interviewSteps">{t("interviewSteps")}</Label>
                  <Input
                    id="interviewSteps"
                    type="number"
                    min={0}
                    className="mono h-9"
                    value={field.state.value ?? ""}
                    onChange={(e) =>
                      field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                    }
                    disabled={isSubmitting}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-danger">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="benefits">
              {(field) => (
                <div className="col-span-1 grid content-start gap-2 sm:col-span-2">
                  <Label htmlFor="benefits">{t("benefits")}</Label>
                  <Textarea
                    id="benefits"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("benefitsPlaceholder")}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </form.Field>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : mode === "create" ? t("create") : t("save")}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
        )}
      </div>
    </form>
  );
}
