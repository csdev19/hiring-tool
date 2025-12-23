import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientTreaty } from "@/lib/client-treaty";

// Type definitions
export interface CompanyDetails {
  id: string;
  interviewId: string;
  website: string | null;
  location: string | null;
  benefits: string | null;
  contactedVia: string | null;
  contactPerson: string | null;
  interviewSteps: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyDetailsInput {
  website?: string;
  location?: string;
  benefits?: string;
  contactedVia?: string;
  contactPerson?: string;
  interviewSteps?: number;
}

export interface UpdateCompanyDetailsInput {
  website?: string;
  location?: string;
  benefits?: string;
  contactedVia?: string;
  contactPerson?: string;
  interviewSteps?: number;
}

// Query keys
const companyDetailsKeys = {
  all: ["company-details"] as const,
  lists: () => [...companyDetailsKeys.all, "list"] as const,
  list: () => [...companyDetailsKeys.lists()] as const,
  details: () => [...companyDetailsKeys.all, "detail"] as const,
  detail: (interviewId: string) => [...companyDetailsKeys.details(), interviewId] as const,
};

// Helper to extract error message from Eden Treaty error response
function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (error && typeof error === "object" && "value" in error) {
    const value = (error as { value: unknown }).value;
    if (typeof value === "string") {
      return value;
    }
    if (value && typeof value === "object" && "message" in value) {
      return String(value.message);
    }
  }
  return "An error occurred";
}

// Fetch company details for interview
export function useCompanyDetails(interviewId: string) {
  return useQuery<{ data: CompanyDetails | null }>({
    queryKey: companyDetailsKeys.detail(interviewId),
    queryFn: async () => {
      const result = await clientTreaty.api.interviews({ id: interviewId })["company-details"].get();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // Backend returns { data: CompanyDetails | null }
      return result.data as { data: CompanyDetails | null };
    },
    enabled: !!interviewId,
  });
}

// Create company details mutation
export function useCreateCompanyDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      interviewId,
      data,
    }: {
      interviewId: string;
      data: CreateCompanyDetailsInput;
    }) => {
      const result = await clientTreaty.api.interviews({ id: interviewId })["company-details"].post(
        data,
      );
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate company details for this interview
      queryClient.invalidateQueries({
        queryKey: companyDetailsKeys.detail(variables.interviewId),
      });
    },
  });
}

// Update company details mutation
export function useUpdateCompanyDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      interviewId,
      data,
    }: {
      interviewId: string;
      data: UpdateCompanyDetailsInput;
    }) => {
      const result = await clientTreaty.api.interviews({ id: interviewId })["company-details"].put(
        data,
      );
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate company details for this interview
      queryClient.invalidateQueries({
        queryKey: companyDetailsKeys.detail(variables.interviewId),
      });
    },
  });
}

// Delete company details mutation
export function useDeleteCompanyDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interviewId: string) => {
      const result = await clientTreaty.api.interviews({ id: interviewId })["company-details"].delete();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    onSuccess: (_, interviewId) => {
      // Invalidate company details for this interview
      queryClient.invalidateQueries({
        queryKey: companyDetailsKeys.detail(interviewId),
      });
    },
  });
}

