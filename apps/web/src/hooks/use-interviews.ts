import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientTreaty } from "@/lib/client-treaty";

// Type definitions based on our schema
export type InterviewStatus = "ongoing" | "rejected" | "dropped-out" | "hired";

export interface Interview {
  id: string;
  companyName: string;
  status: InterviewStatus;
  salary: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateInterviewInput {
  companyName: string;
  status: InterviewStatus;
  salary?: number;
}

export interface UpdateInterviewInput {
  companyName: string;
  status: InterviewStatus;
  salary?: number;
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
        throw new Error(result.error.value as string);
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
        throw new Error(result.error.value as string);
      }
      return result.data;
    },
    enabled: !!id,
  });
}

// Create interview mutation
export function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInterviewInput) => {
      const result = await clientTreaty.api.interviews.post(data);
      if (result.error) {
        throw new Error(result.error.value as string);
      }
      return result.data;
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

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInterviewInput }) => {
      const result = await clientTreaty.api.interviews({ id }).put(data);
      if (result.error) {
        throw new Error(result.error.value as string);
      }
      return result.data;
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

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await clientTreaty.api.interviews({ id }).delete();
      if (result.error) {
        throw new Error(result.error.value as string);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate interviews list
      queryClient.invalidateQueries({ queryKey: interviewKeys.list() });
    },
  });
}
