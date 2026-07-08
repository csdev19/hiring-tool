import type {
  IHiringProcessRepository,
  PaginatedResult,
} from "@interviews-tool/domain/repositories";
import type { HiringProcessBase } from "@interviews-tool/domain/schemas";
import type { PaginationParams, HiringProcessFilterParams } from "@interviews-tool/domain/types";
import type { Prisma, PrismaClient } from "../generated/client";
import { PrismaHiringProcessMapper } from "../mappers/hiring-process.mapper";

/**
 * Prisma implementation of the domain `IHiringProcessRepository` port.
 *
 * It reads/writes the SAME `interviews_tool_hiring_process` table that the Drizzle
 * implementation (`@interviews-tool/infra-db`) uses. Both satisfy the identical domain
 * contract, so an application use case can be served by either repository unchanged.
 */
export class PrismaHiringProcessRepository implements IHiringProcessRepository {
  constructor(private readonly client: PrismaClient) {}

  async findById(id: string, userId: string): Promise<HiringProcessBase | null> {
    const row = await this.client.interviews_tool_hiring_process.findFirst({
      where: { id, user_id: userId, deleted_at: null },
    });

    return row ? PrismaHiringProcessMapper.toDomain(row) : null;
  }

  private buildWhere(
    userId: string,
    filters?: HiringProcessFilterParams,
  ): Prisma.interviews_tool_hiring_processWhereInput {
    const where: Prisma.interviews_tool_hiring_processWhereInput = {
      user_id: userId,
      deleted_at: null,
    };

    if (filters?.statuses && filters.statuses.length > 0) {
      where.status = { in: filters.statuses.map(PrismaHiringProcessMapper.statusToPrisma) };
    }

    const salary: Prisma.IntNullableFilter = {};
    if (filters?.salaryDeclared === true) {
      // A declared salary is a positive amount (zero effectively means "not declared").
      salary.gt = 0;
    }
    if (filters?.salaryMin != null) {
      salary.gte = filters.salaryMin;
    }
    if (filters?.salaryMax != null) {
      salary.lte = filters.salaryMax;
    }
    if (Object.keys(salary).length > 0) {
      where.salary = salary;
    }
    if (filters?.salaryDeclared === false) {
      where.OR = [{ salary: null }, { salary: 0 }];
    }

    return where;
  }

  async findPaginated(
    userId: string,
    params: PaginationParams,
    filters?: HiringProcessFilterParams,
  ): Promise<PaginatedResult<HiringProcessBase>> {
    const safeLimit = Math.min(100, Math.max(1, params.limit ?? 5));
    const safePage = Math.max(1, params.page ?? 1);
    const offset = (safePage - 1) * safeLimit;
    const where = this.buildWhere(userId, filters);

    const [rows, total] = await Promise.all([
      this.client.interviews_tool_hiring_process.findMany({
        where,
        orderBy: { updated_at: "desc" },
        take: safeLimit,
        skip: offset,
      }),
      this.client.interviews_tool_hiring_process.count({ where }),
    ]);

    return {
      data: rows.map(PrismaHiringProcessMapper.toDomain),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async save(hiringProcess: HiringProcessBase): Promise<void> {
    await this.client.interviews_tool_hiring_process.create({
      data: {
        id: hiringProcess.id,
        company_name: hiringProcess.companyName,
        job_title: hiringProcess.jobTitle ?? null,
        status: PrismaHiringProcessMapper.statusToPrisma(hiringProcess.status),
        salary: hiringProcess.salary,
        currency: hiringProcess.currency,
        salary_rate_type: hiringProcess.salaryRateType,
        user_id: hiringProcess.userId,
        created_at: hiringProcess.createdAt,
        updated_at: hiringProcess.updatedAt,
        deleted_at: hiringProcess.deletedAt ?? null,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<HiringProcessBase, "id" | "userId" | "createdAt">>,
  ): Promise<HiringProcessBase> {
    const patch: Prisma.interviews_tool_hiring_processUpdateManyMutationInput = {
      updated_at: new Date(),
    };
    if (data.companyName !== undefined) patch.company_name = data.companyName;
    if (data.jobTitle !== undefined) patch.job_title = data.jobTitle ?? null;
    if (data.status !== undefined)
      patch.status = PrismaHiringProcessMapper.statusToPrisma(data.status);
    if (data.salary !== undefined) patch.salary = data.salary;
    if (data.currency !== undefined) patch.currency = data.currency;
    if (data.salaryRateType !== undefined) patch.salary_rate_type = data.salaryRateType;
    if (data.deletedAt !== undefined) patch.deleted_at = data.deletedAt ?? null;

    const result = await this.client.interviews_tool_hiring_process.updateMany({
      where: { id, user_id: userId },
      data: patch,
    });

    if (result.count === 0) {
      throw new Error("Hiring process not found or unauthorized");
    }

    const updated = await this.findById(id, userId);
    if (!updated) {
      throw new Error("Hiring process not found after update");
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.client.interviews_tool_hiring_process.updateMany({
      where: { id, user_id: userId, deleted_at: null },
      data: { deleted_at: new Date() },
    });
  }
}
