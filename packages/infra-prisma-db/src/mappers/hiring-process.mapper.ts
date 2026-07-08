import type { HiringProcessBase } from "@interviews-tool/domain/schemas";
import {
  HIRING_PROCESS_STATUS_VALUES,
  type HiringProcessStatus,
} from "@interviews-tool/domain/constants";
import type { currency, hiring_process_status, salary_rate_type } from "../generated/client";

/**
 * Scalar shape of an `interviews_tool_hiring_process` row as returned by Prisma
 * (snake_case columns; enum members are Prisma-sanitized, e.g. `first_contact`).
 */
export type PrismaHiringProcessRow = {
  id: string;
  company_name: string;
  job_title: string | null;
  status: hiring_process_status;
  salary: number | null;
  currency: currency;
  salary_rate_type: salary_rate_type;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

// Prisma sanitizes enum labels that are not valid identifiers: the DB label `first-contact`
// is exposed by the client as the member `first_contact`. Domain status values equal the DB
// labels, so we translate on the repository boundary. No status value contains an underscore,
// so the hyphen<->underscore mapping is unambiguous.
const prismaToDomainStatus = Object.fromEntries(
  HIRING_PROCESS_STATUS_VALUES.map((value) => [value.replaceAll("-", "_"), value]),
) as Record<hiring_process_status, HiringProcessStatus>;

const domainToPrismaStatus = Object.fromEntries(
  HIRING_PROCESS_STATUS_VALUES.map((value) => [value, value.replaceAll("-", "_")]),
) as Record<HiringProcessStatus, hiring_process_status>;

/**
 * Maps between Prisma persistence rows and the domain `HiringProcessBase` entity, keeping the
 * domain independent of Prisma's generated types and enum sanitization.
 */
export const PrismaHiringProcessMapper = {
  toDomain(row: PrismaHiringProcessRow): HiringProcessBase {
    return {
      id: row.id,
      userId: row.user_id,
      companyName: row.company_name,
      jobTitle: row.job_title,
      status: prismaToDomainStatus[row.status],
      salary: row.salary,
      currency: row.currency,
      salaryRateType: row.salary_rate_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  },

  statusToPrisma(status: HiringProcessStatus): hiring_process_status {
    return domainToPrismaStatus[status];
  },
};
