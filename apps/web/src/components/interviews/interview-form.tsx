import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateInterviewInput, InterviewStatus } from "@/hooks/use-interviews";

interface InterviewFormProps {
  initialValues?: Partial<CreateInterviewInput>;
  onSubmit: (data: CreateInterviewInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const statusOptions: { value: InterviewStatus; label: string }[] = [
  { value: "ongoing", label: "Ongoing" },
  { value: "rejected", label: "Rejected" },
  { value: "dropped-out", label: "Dropped Out" },
  { value: "hired", label: "Hired" },
];

export function InterviewForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save",
}: InterviewFormProps) {
  // Memoize default values to avoid recreating form on every render
  const defaultValues = useMemo(
    () => ({
      companyName: initialValues?.companyName || "",
      status: initialValues?.status || "ongoing",
      salary: initialValues?.salary,
    }),
    [initialValues?.companyName, initialValues?.status, initialValues?.salary],
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // Update form values when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      form.setFieldValue("companyName", initialValues.companyName || "");
      form.setFieldValue("status", initialValues.status || "ongoing");
      if (initialValues.salary !== undefined) {
        form.setFieldValue("salary", initialValues.salary);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.companyName, initialValues?.status, initialValues?.salary]);

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

      <form.Field name="salary">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor="salary">Salary (USD)</Label>
            <div className="space-y-2">
              <Input
                id="salary"
                type="number"
                min="0"
                max="1000000"
                step="1000"
                value={field.state.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.handleChange(value ? Number(value) : undefined);
                }}
                placeholder="Enter salary (optional)"
                disabled={isSubmitting}
              />
              {field.state.value && (
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={field.state.value || 0}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="w-full"
                  disabled={isSubmitting}
                />
              )}
            </div>
          </div>
        )}
      </form.Field>

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
