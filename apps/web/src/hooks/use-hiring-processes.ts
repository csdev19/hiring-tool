import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { clientTreaty } from "@/lib/client-treaty";
import { getErrorMessage } from "@/lib/error";
import { getHiringProcesses } from "@/functions/get-hiring-processes";
import type {
  HiringProcessBase,
  CreateHiringProcess,
  UpdateHiringProcess,
} from "@interviews-tool/domain/schemas";
import type { HiringProcessStatus } from "@interviews-tool/domain/constants";

// Re-export types from domain package
export type { Currency, HiringProcessStatus } from "@interviews-tool/domain/constants";

// Re-export domain types for convenience
export type HiringProcess = HiringProcessBase;
export type CreateHiringProcessInput = CreateHiringProcess;
export type UpdateHiringProcessInput = UpdateHiringProcess;

// Pagination params type
export interface PaginationParams {
  page: number;
  limit: number;
}

// Filter params type
export interface FilterParams {
  statuses?: HiringProcessStatus[];
  salaryDeclared?: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

// Combined params
export interface HiringProcessListParams extends PaginationParams {
  filters?: FilterParams;
}

// Query keys
const hiringProcessKeys = {
  all: ["hiringProcesses"] as const,
  lists: () => [...hiringProcessKeys.all, "list"] as const,
  list: (params?: HiringProcessListParams) => [...hiringProcessKeys.lists(), params] as const,
  details: () => [...hiringProcessKeys.all, "detail"] as const,
  detail: (id: string) => [...hiringProcessKeys.details(), id] as const,
};

// Standalone query options — usable in both hooks and route loaders
export function hiringProcessesQueryOptions(
  params: HiringProcessListParams = { page: 1, limit: 5 },
) {
  return queryOptions({
    queryKey: hiringProcessKeys.list(params),
    queryFn: () =>
      getHiringProcesses({
        data: {
          page: params.page,
          limit: params.limit,
          ...params.filters,
        },
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// Fetch all hiring processes with pagination and filters
export function useHiringProcesses(params: HiringProcessListParams = { page: 1, limit: 5 }) {
  return useQuery(hiringProcessesQueryOptions(params));
}

// Fetch single hiring process
export function useHiringProcess(id: string) {
  return useQuery({
    queryKey: hiringProcessKeys.detail(id),
    queryFn: async () => {
      const result = await clientTreaty.api.v1["hiring-processes"]({ id }).get();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      if (!result.data) {
        throw new Error("No data returned from server");
      }
      const { error, data } = result.data;
      if (error) {
        throw new Error(error?.message || "An error occurred");
      }
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Create hiring process mutation
export function useCreateHiringProcess() {
  const queryClient = useQueryClient();

  return useMutation<HiringProcess, Error, CreateHiringProcessInput>({
    mutationFn: async (data: CreateHiringProcessInput): Promise<HiringProcess> => {
      const result = await clientTreaty.api.v1["hiring-processes"].post(data);
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // Backend returns { data: HiringProcess }, so we need to access result.data.data
      return (result.data as { data: HiringProcess }).data;
    },
    onSuccess: () => {
      // Invalidate and refetch hiring processes list (all pagination variants)
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.lists() });
    },
  });
}

// Update hiring process mutation
export function useUpdateHiringProcess() {
  const queryClient = useQueryClient();

  return useMutation<HiringProcess, Error, { id: string; data: UpdateHiringProcessInput }>({
    mutationFn: async ({ id, data }): Promise<HiringProcess> => {
      const result = await clientTreaty.api.v1["hiring-processes"]({ id }).put(data);
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      // Backend returns { data: HiringProcess }, so we need to access result.data.data
      return (result.data as { data: HiringProcess }).data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and specific detail
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.detail(variables.id) });
    },
  });
}

// Delete hiring process mutation
export function useDeleteHiringProcess() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const result = await clientTreaty.api.v1["hiring-processes"]({ id }).delete();
      if (result.error) {
        throw new Error(getErrorMessage(result.error));
      }
      return;
    },
    onSuccess: () => {
      // Invalidate hiring processes list (all pagination variants)
      queryClient.invalidateQueries({ queryKey: hiringProcessKeys.lists() });
    },
  });
}
