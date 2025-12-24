import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db";
import { hiringProcess, type NewHiringProcess } from "@interviews-tool/db/schema/hiring-process";
import { INTERVIEW_STATUSES, CURRENCIES } from "@interviews-tool/domain/constants";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@interviews-tool/auth";
import { UnauthorizedError, NotFoundError } from "../utils/errors";

// Helper to get user from session
async function getUserFromRequest(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }
  return { id: session.user.id };
}

export const hiringProcessRoutes = new Elysia({ prefix: "/api/hiring-processes" })
  .error({
    UnauthorizedError,
    NotFoundError,
  })
  .onError(({ code, error, set }) => {
    // Handle custom errors with proper status codes
    if (code === "UnauthorizedError" || code === "NotFoundError") {
      set.status = error.status;
      return {
        message: error.message,
      };
    }
    // Handle validation errors
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        message: error.message,
      };
    }
    // Handle unknown errors
    set.status = 500;
    return {
      message: "Internal server error",
    };
  })
  // List all hiring processes for authenticated user
  .get("/", async ({ request }) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      throw new UnauthorizedError();
    }

    const processes = await db
      .select()
      .from(hiringProcess)
      .where(eq(hiringProcess.userId, user.id))
      .orderBy(desc(hiringProcess.updatedAt));

    return { data: processes };
  })
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
        .from(hiringProcess)
        .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

      if (!result) {
        throw new NotFoundError("Hiring process");
      }

      return { data: result };
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
    async ({ request, body }) => {
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

      const [created] = await db.insert(hiringProcess).values(newHiringProcess).returning();

      return { data: created };
    },
    {
      body: t.Object({
        companyName: t.String({ minLength: 1 }),
        status: t.Union([
          t.Literal(INTERVIEW_STATUSES.ONGOING),
          t.Literal(INTERVIEW_STATUSES.REJECTED),
          t.Literal(INTERVIEW_STATUSES.DROPPED_OUT),
          t.Literal(INTERVIEW_STATUSES.HIRED),
        ]),
        salary: t.Optional(t.Number({ minimum: 0 })),
        currency: t.Optional(t.Union([t.Literal(CURRENCIES.USD), t.Literal(CURRENCIES.PEN)])),
      }),
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
        .from(hiringProcess)
        .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

      if (!existing) {
        throw new NotFoundError("Hiring process");
      }

      const [updated] = await db
        .update(hiringProcess)
        .set({
          companyName: body.companyName,
          status: body.status,
          salary: body.salary,
          currency: body.currency || existing.currency || CURRENCIES.USD,
          updatedAt: new Date(),
        })
        .where(eq(hiringProcess.id, params.id))
        .returning();

      return { data: updated };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        companyName: t.String({ minLength: 1 }),
        status: t.Union([
          t.Literal(INTERVIEW_STATUSES.ONGOING),
          t.Literal(INTERVIEW_STATUSES.REJECTED),
          t.Literal(INTERVIEW_STATUSES.DROPPED_OUT),
          t.Literal(INTERVIEW_STATUSES.HIRED),
        ]),
        salary: t.Optional(t.Number({ minimum: 0 })),
        currency: t.Optional(t.Union([t.Literal(CURRENCIES.USD), t.Literal(CURRENCIES.PEN)])),
      }),
    },
  )
  // Delete hiring process
  .delete(
    "/:id",
    async ({ request, params }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Check if hiring process exists and belongs to user
      const [existing] = await db
        .select()
        .from(hiringProcess)
        .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

      if (!existing) {
        throw new NotFoundError("Hiring process");
      }

      await db.delete(hiringProcess).where(eq(hiringProcess.id, params.id));

      return { message: "Hiring process deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
