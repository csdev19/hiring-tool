import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientTreaty } from "@/lib/client-treaty";
import type { Currency, InterviewStatus } from "@interviews-tool/domain/constants";

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

// Re-export types from domain package
export type { Currency, InterviewStatus } from "@interviews-tool/domain/constants";

// Type definitions based on our schema
export interface HiringProcess {
  id: string;
  companyName: string;
  status: InterviewStatus;
  salary: number | null;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateHiringProcessInput {
  companyName: string;
  status: InterviewStatus;
  salary?: number;
  currency?: Currency;
}

export interface UpdateHiringProcessInput {
  companyName: string;
  status: InterviewStatus;
  salary?: number;
  currency?: Currency;
}

// Query keys
const hiringProcessKeys = {
  all: ["hiringProcesses"] as const,
  lists: () => [...hiringProcessKeys.all, "list"] as const,
  list: () => [...hiringProcessKeys.lists()] as const,
  details: () => [...hiringProcessKeys.all, "detail"] as const,
  detail: (id: string) => [...hiringProcessKeys.details(), id] as const,
};

// Fetch all hiring processes
export function useHiringProcesses() {
  return useQuery({
    queryKey: hiringProcessKeys.list(),
    queryFn: async () => {
      const result = await clientTreaty.api["hiring-processes"].get();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
  });
}

// Fetch single hiring process
export function useHiringProcess(id: string) {
  return useQuery({
    queryKey: hiringProcessKeys.detail(id),
    queryFn: async () => {
      const result = await clientTreaty.api["hiring-processes"]({ id }).get();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    enabled: !!id,
  });
}

// Create hiring process mutation
export function useCreateHiringProcess() {
  const queryClient = useQueryClient();

  return useMutation<HiringProcess, Error, CreateHiringProcessInput>({
    mutationFn: async (data: CreateHiringProcessInput): Promise<HiringProcess> => {
      const result = await clientTreaty.api["hiring-processes"].post(data);
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // Backend returns { data: HiringProcess }, so we need to access result.data.data
      return (result.data as { data: HiringProcess }).data;
    },
    onSuccess: () => {
      // Invalidate and refetch hiring processes list
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.list() });
    },
  });
}

// Update hiring process mutation
export function useUpdateHiringProcess() {
  const queryClient = useQueryClient();

  return useMutation<HiringProcess, Error, { id: string; data: UpdateHiringProcessInput }>({
    mutationFn: async ({ id, data }): Promise<HiringProcess> => {
      const result = await clientTreaty.api["hiring-processes"]({ id }).put(data);
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // Backend returns { data: HiringProcess }, so we need to access result.data.data
      return (result.data as { data: HiringProcess }).data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and specific detail
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.list() });
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.detail(variables.id) });
    },
  });
}

// Delete hiring process mutation
export function useDeleteHiringProcess() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id: string) => {
      const result = await clientTreaty.api["hiring-processes"]({ id }).delete();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate hiring processes list
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.list() });
    },
  });
}
