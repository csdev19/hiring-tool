import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db";
import { interview, type NewInterview } from "@interviews-tool/db/schema/interview";
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

export const interviewRoutes = new Elysia({ prefix: "/api/interviews" })
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
  // List all interviews for authenticated user
  .get("/", async ({ request }) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      throw new UnauthorizedError();
    }

    const interviews = await db
      .select()
      .from(interview)
      .where(eq(interview.userId, user.id))
      .orderBy(desc(interview.updatedAt));

    return { data: interviews };
  })
  // Get single interview
  .get(
    "/:id",
    async ({ request, params }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      const [result] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!result) {
        throw new NotFoundError("Interview");
      }

      return { data: result };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  // Create new interview
  .post(
    "/",
    async ({ request, body }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Generate UUID for new interview
      const id = crypto.randomUUID();

      const newInterview: NewInterview = {
        id,
        companyName: body.companyName,
        status: body.status,
        salary: body.salary,
        currency: body.currency || CURRENCIES.USD,
        userId: user.id,
      };

      const [created] = await db.insert(interview).values(newInterview).returning();

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
  // Update interview
  .put(
    "/:id",
    async ({ request, params, body }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Check if interview exists and belongs to user
      const [existing] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!existing) {
        throw new NotFoundError("Interview");
      }

      const [updated] = await db
        .update(interview)
        .set({
          companyName: body.companyName,
          status: body.status,
          salary: body.salary,
          currency: body.currency || existing.currency || CURRENCIES.USD,
          updatedAt: new Date(),
        })
        .where(eq(interview.id, params.id))
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
  // Delete interview
  .delete(
    "/:id",
    async ({ request, params }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Check if interview exists and belongs to user
      const [existing] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!existing) {
        throw new NotFoundError("Interview");
      }

      await db.delete(interview).where(eq(interview.id, params.id));

      return { message: "Interview deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
