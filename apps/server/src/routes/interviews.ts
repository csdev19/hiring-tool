import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db";
import { interview, type Interview, type NewInterview } from "@interviews-tool/db/schema/interview";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@interviews-tool/auth";

// Helper to get user from session
async function getUserFromRequest(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }
  return { id: session.user.id };
}

// Interview status enum
const interviewStatuses = ["ongoing", "rejected", "dropped-out", "hired"] as const;

export const interviewRoutes = new Elysia({ prefix: "/api/interviews" })
  // List all interviews for authenticated user
  .get("/", async ({ request, error }) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      return error(401, { message: "Unauthorized" });
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
    async ({ request, params, error }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return error(401, { message: "Unauthorized" });
      }

      const [result] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!result) {
        return error(404, { message: "Interview not found" });
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
    async ({ request, body, error }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return error(401, { message: "Unauthorized" });
      }

      // Generate UUID for new interview
      const id = crypto.randomUUID();

      const newInterview: NewInterview = {
        id,
        companyName: body.companyName,
        status: body.status,
        salary: body.salary,
        userId: user.id,
      };

      const [created] = await db.insert(interview).values(newInterview).returning();

      return { data: created };
    },
    {
      body: t.Object({
        companyName: t.String({ minLength: 1 }),
        status: t.Union([
          t.Literal("ongoing"),
          t.Literal("rejected"),
          t.Literal("dropped-out"),
          t.Literal("hired"),
        ]),
        salary: t.Optional(t.Number({ minimum: 0 })),
      }),
    },
  )
  // Update interview
  .put(
    "/:id",
    async ({ request, params, body, error }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return error(401, { message: "Unauthorized" });
      }

      // Check if interview exists and belongs to user
      const [existing] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!existing) {
        return error(404, { message: "Interview not found" });
      }

      const [updated] = await db
        .update(interview)
        .set({
          companyName: body.companyName,
          status: body.status,
          salary: body.salary,
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
          t.Literal("ongoing"),
          t.Literal("rejected"),
          t.Literal("dropped-out"),
          t.Literal("hired"),
        ]),
        salary: t.Optional(t.Number({ minimum: 0 })),
      }),
    },
  )
  // Delete interview
  .delete(
    "/:id",
    async ({ request, params, error }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return error(401, { message: "Unauthorized" });
      }

      // Check if interview exists and belongs to user
      const [existing] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!existing) {
        return error(404, { message: "Interview not found" });
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
