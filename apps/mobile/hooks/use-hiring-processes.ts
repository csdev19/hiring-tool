import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface HiringProcess {
  id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  salary: number | null;
  currency: string;
  salaryRateType: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface HiringProcessesResponse {
  data: HiringProcess[];
  error: null;
  meta: {
    pagination: PaginationMeta;
  };
}

interface UseHiringProcessesParams {
  limit?: number;
}

export function useHiringProcesses(params: UseHiringProcessesParams = {}) {
  const { limit = 10 } = params;

  return useInfiniteQuery({
    queryKey: ["hiring-processes", { limit }],
    queryFn: ({ pageParam }) =>
      apiFetch<HiringProcessesResponse>("/api/v1/hiring-processes", {
        params: { page: pageParam, limit },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
