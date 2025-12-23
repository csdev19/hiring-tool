import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateInterviewInput, InterviewStatus, Currency } from "@/hooks/use-interviews";
import type { CreateCompanyDetailsInput } from "@/hooks/use-company-details";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InterviewFormProps {
  initialValues?: Partial<CreateInterviewInput>;
  initialCompanyDetails?: Partial<CreateCompanyDetailsInput>;
  onSubmit: (data: CreateInterviewInput, companyDetails?: CreateCompanyDetailsInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const contactedViaOptions = [
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Email", label: "Email" },
  { value: "Facebook", label: "Facebook" },
  { value: "Other", label: "Other" },
];

const statusOptions: { value: InterviewStatus; label: string }[] = [
  { value: "ongoing", label: "Ongoing" },
  { value: "rejected", label: "Rejected" },
  { value: "dropped-out", label: "Dropped Out" },
  { value: "hired", label: "Hired" },
];

const currencyOptions: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "PEN", label: "Peruvian Sol", symbol: "S/" },
];

export function InterviewForm({
  initialValues,
  initialCompanyDetails,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save",
}: InterviewFormProps) {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  // Memoize default values to avoid recreating form on every render
  const defaultValues = useMemo(
    () => ({
      companyName: initialValues?.companyName || "",
      status: initialValues?.status || "ongoing",
      salary: initialValues?.salary,
      currency: initialValues?.currency || "USD",
    }),
    [initialValues?.companyName, initialValues?.status, initialValues?.salary, initialValues?.currency],
  );

  const defaultCompanyDetailsValues = useMemo(
    () => ({
      website: initialCompanyDetails?.website || "",
      location: initialCompanyDetails?.location || "",
      benefits: initialCompanyDetails?.benefits || "",
      contactedVia: initialCompanyDetails?.contactedVia || "",
      contactPerson: initialCompanyDetails?.contactPerson || "",
      interviewSteps: initialCompanyDetails?.interviewSteps || 0,
    }),
    [
      initialCompanyDetails?.website,
      initialCompanyDetails?.location,
      initialCompanyDetails?.benefits,
      initialCompanyDetails?.contactedVia,
      initialCompanyDetails?.contactPerson,
      initialCompanyDetails?.interviewSteps,
    ],
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const companyDetailsData: CreateCompanyDetailsInput = {
        website: companyDetailsForm.state.values.website || undefined,
        location: companyDetailsForm.state.values.location || undefined,
        benefits: companyDetailsForm.state.values.benefits || undefined,
        contactedVia: companyDetailsForm.state.values.contactedVia || undefined,
        contactPerson: companyDetailsForm.state.values.contactPerson || undefined,
        interviewSteps: companyDetailsForm.state.values.interviewSteps || undefined,
      };

      // Only include company details if at least one field is filled
      const hasCompanyDetails = Object.values(companyDetailsData).some(
        (val) => val !== undefined && val !== "" && val !== 0,
      );

      onSubmit(value, hasCompanyDetails ? companyDetailsData : undefined);
    },
  });

  const companyDetailsForm = useForm({
    defaultValues: defaultCompanyDetailsValues,
  });

  // Update form values when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      form.setFieldValue("companyName", initialValues.companyName || "");
      form.setFieldValue("status", initialValues.status || "ongoing");
      form.setFieldValue("currency", initialValues.currency || "USD");
      if (initialValues.salary !== undefined) {
        form.setFieldValue("salary", initialValues.salary);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.companyName, initialValues?.status, initialValues?.salary, initialValues?.currency]);

  // Update company details form values when initialCompanyDetails change
  useEffect(() => {
    if (initialCompanyDetails) {
      companyDetailsForm.setFieldValue("website", initialCompanyDetails.website || "");
      companyDetailsForm.setFieldValue("location", initialCompanyDetails.location || "");
      companyDetailsForm.setFieldValue("benefits", initialCompanyDetails.benefits || "");
      companyDetailsForm.setFieldValue("contactedVia", initialCompanyDetails.contactedVia || "");
      companyDetailsForm.setFieldValue("contactPerson", initialCompanyDetails.contactPerson || "");
      companyDetailsForm.setFieldValue(
        "interviewSteps",
        initialCompanyDetails.interviewSteps || 0,
      );
      if (initialCompanyDetails.website || initialCompanyDetails.location) {
        setShowCompanyDetails(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialCompanyDetails?.website,
    initialCompanyDetails?.location,
    initialCompanyDetails?.benefits,
    initialCompanyDetails?.contactedVia,
    initialCompanyDetails?.contactPerson,
    initialCompanyDetails?.interviewSteps,
  ]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="companyName"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Company name is required"
              : value.length < 1
                ? "Company name is required"
                : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="companyName">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter company name"
              disabled={isSubmitting}
            />
            {field.state.meta.errors && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="status">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <select
              id="status"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as InterviewStatus)}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="currency">
        {(currencyField) => (
          <form.Field name="salary">
            {(salaryField) => (
              <div className="space-y-1.5">
                <Label htmlFor="salary">Monthly Salary (Optional)</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="salary"
                        type="number"
                        min="0"
                        max="50000"
                        step="100"
                        value={salaryField.state.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          salaryField.handleChange(value ? Number(value) : undefined);
                        }}
                        placeholder="Enter salary (optional)"
                        disabled={isSubmitting}
                      />
                    </div>
                    <select
                      id="currency"
                      value={currencyField.state.value}
                      onChange={(e) => currencyField.handleChange(e.target.value as Currency)}
                      className="flex h-8 w-24 rounded-md border border-input bg-background px-2.5 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="100"
                    value={salaryField.state.value || 0}
                    onChange={(e) => salaryField.handleChange(Number(e.target.value))}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
          </form.Field>
        )}
      </form.Field>

      {/* Company Details Section */}
      <div className="border-t pt-4 mt-4">
        <button
          type="button"
          onClick={() => setShowCompanyDetails(!showCompanyDetails)}
          className="flex items-center justify-between w-full text-left"
          disabled={isSubmitting}
        >
          <Label className="text-sm font-medium cursor-pointer">Company Details (Optional)</Label>
          {showCompanyDetails ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>

        {showCompanyDetails && (
          <div className="space-y-4 mt-4">
            <companyDetailsForm.Field name="website">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://example.com"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </companyDetailsForm.Field>

            <companyDetailsForm.Field name="location">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="City, Country"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </companyDetailsForm.Field>

            <companyDetailsForm.Field name="benefits">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe company benefits..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </companyDetailsForm.Field>

            <companyDetailsForm.Field name="contactedVia">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="contactedVia">Contacted Via</Label>
                  <select
                    id="contactedVia"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="">Select an option</option>
                    {contactedViaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </companyDetailsForm.Field>

            <companyDetailsForm.Field name="contactPerson">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="@username or name"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </companyDetailsForm.Field>

            <companyDetailsForm.Field name="interviewSteps">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="interviewSteps">Interview Steps</Label>
                  <Input
                    id="interviewSteps"
                    type="number"
                    min="0"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </companyDetailsForm.Field>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
