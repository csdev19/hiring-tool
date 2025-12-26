import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db";
import { hiringProcessTable, type NewHiringProcess } from "@interviews-tool/db/schemas";
import { CURRENCIES } from "@interviews-tool/domain/constants";
import {
  createHiringProcessSchema,
  updateHiringProcessSchema,
  paginationQuerySchema,
} from "@interviews-tool/domain/schemas";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@interviews-tool/auth";
import { UnauthorizedError, NotFoundError } from "../utils/errors";
import {
  successBody,
  createdBody,
  successWithPaginationBody,
  getPaginationParams,
} from "../utils/response-helpers";
import { errorHandlerPlugin } from "../utils/error-handler-plugin";

// Helper to get user from session
async function getUserFromRequest(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }
  return { id: session.user.id };
}

export const hiringProcessRoutes = new Elysia({ prefix: "/api/hiring-processes" })
  .use(errorHandlerPlugin)
  // List all hiring processes for authenticated user
  .get(
    "/",
    async ({ request, query, status }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      const pagination = getPaginationParams(query);

      const processes = await db
        .select()
        .from(hiringProcessTable)
        .where(eq(hiringProcessTable.userId, user.id))
        .orderBy(desc(hiringProcessTable.updatedAt))
        .limit(pagination.limit)
        .offset(pagination.offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(hiringProcessTable)
        .where(eq(hiringProcessTable.userId, user.id));

      const total = countResult[0] ? Number(countResult[0].count) : 0;

      return status(200, successWithPaginationBody(processes, pagination, total));
    },
    {
      query: paginationQuerySchema,
    },
  )
  // Get single hiring process
  .get(
    "/:id",
    async ({ request, params }) => {
      const user = await getUserFromRequest(request);

      if (!user) {
        throw new UnauthorizedError();
      }

      const [result] = await db
        .select()
        .from(hiringProcessTable)
        .where(and(eq(hiringProcessTable.id, params.id), eq(hiringProcessTable.userId, user.id)));

      if (!result) {
        throw new NotFoundError("Hiring process");
      }

      return successBody(result);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  // Create new hiring process
  .post(
    "/",
    async ({ request, body, status }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Generate UUID for new hiring process
      const id = crypto.randomUUID();

      const newHiringProcess: NewHiringProcess = {
        id,
        companyName: body.companyName,
        status: body.status,
        salary: body.salary,
        currency: body.currency || CURRENCIES.USD,
        userId: user.id,
      };

      const [createdProcess] = await db
        .insert(hiringProcessTable)
        .values(newHiringProcess)
        .returning();

      return status(201, createdBody(createdProcess));
    },
    {
      body: createHiringProcessSchema,
    },
  )
  // Update hiring process
  .put(
    "/:id",
    async ({ request, params, body }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Check if hiring process exists and belongs to user
      const [existing] = await db
        .select()
        .from(hiringProcessTable)
        .where(and(eq(hiringProcessTable.id, params.id), eq(hiringProcessTable.userId, user.id)));

      if (!existing) {
        throw new NotFoundError("Hiring process");
      }

      const [updated] = await db
        .update(hiringProcessTable)
        .set({
          companyName: body.companyName,
          status: body.status,
          salary: body.salary,
          currency: body.currency || existing.currency || CURRENCIES.USD,
          updatedAt: new Date(),
        })
        .where(eq(hiringProcessTable.id, params.id))
        .returning();

      return successBody(updated);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: updateHiringProcessSchema,
    },
  )
  // Delete hiring process
  .delete(
    "/:id",
    async ({ request, params, status }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Check if hiring process exists and belongs to user
      const [existing] = await db
        .select()
        .from(hiringProcessTable)
        .where(and(eq(hiringProcessTable.id, params.id), eq(hiringProcessTable.userId, user.id)));

      if (!existing) {
        throw new NotFoundError("Hiring process");
      }

      await db.delete(hiringProcessTable).where(eq(hiringProcessTable.id, params.id));

      return status(204);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
