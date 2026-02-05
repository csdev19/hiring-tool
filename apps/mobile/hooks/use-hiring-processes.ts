import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

interface HiringProcess {
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
  page?: number;
  limit?: number;
}

export function useHiringProcesses(params: UseHiringProcessesParams = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["hiring-processes", { page, limit }],
    queryFn: () =>
      apiFetch<HiringProcessesResponse>("/api/v1/hiring-processes", {
        params: { page, limit },
      }),
  });
}
