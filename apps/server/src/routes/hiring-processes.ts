import { Elysia, t } from "elysia";
import { createDatabaseClient } from "@interviews-tool/db/client";
import { HiringProcessRepository } from "@interviews-tool/db/repositories";
import { CURRENCIES, SALARY_RATE_TYPES } from "@interviews-tool/domain/constants";
import {
  createHiringProcessSchema,
  updateHiringProcessSchema,
  hiringProcessQuerySchema,
} from "@interviews-tool/domain/schemas";
import { NotFoundError } from "../utils/errors";
import { successBody, createdBody, successWithPaginationBody } from "../utils/response-helpers";
import { errorHandlerPlugin } from "../utils/error-handler-plugin";
import { env } from "cloudflare:workers";
import { authMacro } from "@/plugins/auth.plugin";

export const hiringProcessRoutes = new Elysia({ prefix: "/hiring-processes" })
  .use(errorHandlerPlugin)
  .decorate("db", createDatabaseClient(env.DATABASE_URL))
  .derive(({ db }) => ({
    hiringProcessRepo: new HiringProcessRepository(db),
  }))
  .use(authMacro)
  .get(
    "/",
    async ({ query, status, hiringProcessRepo, user }) => {
      const result = await hiringProcessRepo.findPaginated(
        user.id,
        {
          page: query.page || 1,
          limit: query.limit || 10,
        },
        {
          statuses: query.statuses,
          salaryDeclared: query.salaryDeclared,
          salaryMin: query.salaryMin,
          salaryMax: query.salaryMax,
        },
      );

      const paginationResult = {
        page: result.page,
        limit: result.limit,
        offset: (result.page - 1) * result.limit,
      };

      return status(200, successWithPaginationBody(result.data, paginationResult, result.total));
    },
    {
      query: hiringProcessQuerySchema,
      isAuth: true,
    },
  )
  // Get single hiring process
  .get(
    "/:id",
    async ({ params, hiringProcessRepo, user }) => {
      const result = await hiringProcessRepo.findById(params.id, user.id);

      if (!result) {
        throw new NotFoundError("Hiring process");
      }

      return successBody(result);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      isAuth: true,
    },
  )
  // Create new hiring process
  .post(
    "/",
    async ({ body, status, hiringProcessRepo, user }) => {
      // Generate UUID for new hiring process
      const id = crypto.randomUUID();

      const newHiringProcess = {
        id,
        companyName: body.companyName,
        jobTitle: body.jobTitle,
        status: body.status,
        salary: body.salary ?? null,
        currency: body.currency || CURRENCIES.USD,
        salaryRateType: body.salaryRateType || SALARY_RATE_TYPES.MONTHLY,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      await hiringProcessRepo.save(newHiringProcess);

      return status(201, createdBody(newHiringProcess));
    },
    {
      body: createHiringProcessSchema,
      isAuth: true,
    },
  )
  // Update hiring process
  .put(
    "/:id",
    async ({ params, body, hiringProcessRepo, user }) => {
      // Check if hiring process exists and belongs to user
      const existing = await hiringProcessRepo.findById(params.id, user.id);

      if (!existing) {
        throw new NotFoundError("Hiring process");
      }

      const updated = await hiringProcessRepo.update(params.id, user.id, {
        companyName: body.companyName,
        jobTitle: body.jobTitle,
        status: body.status,
        salary: body.salary,
        currency: body.currency || existing.currency || CURRENCIES.USD,
        salaryRateType: body.salaryRateType ?? existing.salaryRateType,
      });

      return successBody(updated);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: updateHiringProcessSchema,
      isAuth: true,
    },
  )
  // Delete hiring process
  .delete(
    "/:id",
    async ({ params, status, hiringProcessRepo, user }) => {
      // Check if hiring process exists and belongs to user
      const existing = await hiringProcessRepo.findById(params.id, user.id);

      if (!existing) {
        throw new NotFoundError("Hiring process");
      }

      // Soft delete by setting deletedAt timestamp
      await hiringProcessRepo.delete(params.id, user.id);

      return status(204);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      isAuth: true,
    },
  );
