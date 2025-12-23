import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientTreaty } from "@/lib/client-treaty";

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

// Type definitions based on our schema
export type InterviewStatus = "ongoing" | "rejected" | "dropped-out" | "hired";
export type Currency = "USD" | "PEN";

export interface Interview {
  id: string;
  companyName: string;
  status: InterviewStatus;
  salary: number | null;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateInterviewInput {
  companyName: string;
  status: InterviewStatus;
  salary?: number;
  currency?: Currency;
}

export interface UpdateInterviewInput {
  companyName: string;
  status: InterviewStatus;
  salary?: number;
  currency?: Currency;
}

// Query keys
const interviewKeys = {
  all: ["interviews"] as const,
  lists: () => [...interviewKeys.all, "list"] as const,
  list: () => [...interviewKeys.lists()] as const,
  details: () => [...interviewKeys.all, "detail"] as const,
  detail: (id: string) => [...interviewKeys.details(), id] as const,
};

// Fetch all interviews
export function useInterviews() {
  return useQuery({
    queryKey: interviewKeys.list(),
    queryFn: async () => {
      const result = await clientTreaty.api.interviews.get();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
  });
}

// Fetch single interview
export function useInterview(id: string) {
  return useQuery({
    queryKey: interviewKeys.detail(id),
    queryFn: async () => {
      const result = await clientTreaty.api.interviews({ id }).get();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    enabled: !!id,
  });
}

// Create interview mutation
export function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation<Interview, Error, CreateInterviewInput>({
    mutationFn: async (data: CreateInterviewInput): Promise<Interview> => {
      const result = await clientTreaty.api.interviews.post(data);
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // Backend returns { data: Interview }, so we need to access result.data.data
      return (result.data as { data: Interview }).data;
    },
    onSuccess: () => {
      // Invalidate and refetch interviews list
      queryClient.invalidateQueries({ queryKey: interviewKeys.list() });
    },
  });
}

// Update interview mutation
export function useUpdateInterview() {
  const queryClient = useQueryClient();

  return useMutation<Interview, Error, { id: string; data: UpdateInterviewInput }>({
    mutationFn: async ({ id, data }): Promise<Interview> => {
      const result = await clientTreaty.api.interviews({ id }).put(data);
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // TODO: check this, a weird object we should check the error to trigger a message
      // Backend returns { data: Interview }, so we need to access result.data.data
      return (result.data as { data: Interview }).data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and specific detail
      queryClient.invalidateQueries({ queryKey: interviewKeys.list() });
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(variables.id) });
    },
  });
}

// Delete interview mutation
export function useDeleteInterview() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id: string) => {
      const result = await clientTreaty.api.interviews({ id }).delete();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate interviews list
      queryClient.invalidateQueries({ queryKey: interviewKeys.list() });
    },
  });
}
