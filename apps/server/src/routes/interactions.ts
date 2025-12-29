import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db/client";
import {
  hiringProcessTable,
  interactionTable,
  type NewInteraction,
} from "@interviews-tool/db/schemas";
import { eq, and, desc, isNull } from "drizzle-orm";
import { auth } from "@interviews-tool/auth";
import { createInteractionSchema, updateInteractionSchema } from "@interviews-tool/domain/schemas";
import { UnauthorizedError, NotFoundError } from "../utils/errors";
import { successBody, createdBody } from "../utils/response-helpers";
import { errorHandlerPlugin } from "../utils/error-handler-plugin";

async function getUserFromRequest(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }
  return { id: session.user.id };
}

export const interactionRoutes = new Elysia({
  prefix: "/api/hiring-processes/:id/interactions",
})
  .use(errorHandlerPlugin)
  // List interactions
  .get("/", async ({ request, params }) => {
    const user = await getUserFromRequest(request);
    if (!user) throw new UnauthorizedError();

    const [hiringProcessRecord] = await db
      .select()
      .from(hiringProcessTable)
      .where(
        and(
          eq(hiringProcessTable.id, params.id),
          eq(hiringProcessTable.userId, user.id),
          isNull(hiringProcessTable.deletedAt),
        ),
      );

    if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

    const interactions = await db
      .select()
      .from(interactionTable)
      .where(
        and(eq(interactionTable.hiringProcessId, params.id), isNull(interactionTable.deletedAt)),
      )
      .orderBy(desc(interactionTable.createdAt));

    // Always return an array, even if empty
    return successBody(interactions || []);
  })
  // Create interaction
  .post(
    "/",
    async ({ request, params, body, status }) => {
      const user = await getUserFromRequest(request);
      if (!user) throw new UnauthorizedError();

      const [hiringProcessRecord] = await db
        .select()
        .from(hiringProcessTable)
        .where(
          and(
            eq(hiringProcessTable.id, params.id),
            eq(hiringProcessTable.userId, user.id),
            isNull(hiringProcessTable.deletedAt),
          ),
        );

      if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

      const id = crypto.randomUUID();
      const newInteraction: NewInteraction = {
        id,
        hiringProcessId: params.id,
        title: body.title,
        content: body.content,
        type: body.type,
      };

      const [created] = await db.insert(interactionTable).values(newInteraction).returning();
      return status(201, createdBody(created));
    },
    {
      body: createInteractionSchema,
    },
  )
  // Update interaction
  .put(
    "/:interactionId",
    async ({ request, params, body }) => {
      const user = await getUserFromRequest(request);
      if (!user) throw new UnauthorizedError();

      const [hiringProcessRecord] = await db
        .select()
        .from(hiringProcessTable)
        .where(
          and(
            eq(hiringProcessTable.id, params.id),
            eq(hiringProcessTable.userId, user.id),
            isNull(hiringProcessTable.deletedAt),
          ),
        );

      if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

      const [existing] = await db
        .select()
        .from(interactionTable)
        .where(
          and(eq(interactionTable.id, params.interactionId), isNull(interactionTable.deletedAt)),
        );

      if (!existing) throw new NotFoundError("Interaction");

      const [updated] = await db
        .update(interactionTable)
        .set({
          title: body.title,
          content: body.content,
          type: body.type,
          updatedAt: new Date(),
        })
        .where(eq(interactionTable.id, params.interactionId))
        .returning();

      return successBody(updated);
    },
    {
      params: t.Object({
        id: t.String(),
        interactionId: t.String(),
      }),
      body: updateInteractionSchema,
    },
  )
  // Delete interaction
  .delete(
    "/:interactionId",
    async ({ request, params, set }) => {
      const user = await getUserFromRequest(request);
      if (!user) throw new UnauthorizedError();

      const [hiringProcessRecord] = await db
        .select()
        .from(hiringProcessTable)
        .where(
          and(
            eq(hiringProcessTable.id, params.id),
            eq(hiringProcessTable.userId, user.id),
            isNull(hiringProcessTable.deletedAt),
          ),
        );

      if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

      const [existing] = await db
        .select()
        .from(interactionTable)
        .where(
          and(eq(interactionTable.id, params.interactionId), isNull(interactionTable.deletedAt)),
        );

      if (!existing) throw new NotFoundError("Interaction");

      // Soft delete by setting deletedAt timestamp
      await db
        .update(interactionTable)
        .set({ deletedAt: new Date() })
        .where(eq(interactionTable.id, params.interactionId));
      set.status = 204;
    },
    {
      params: t.Object({
        id: t.String(),
        interactionId: t.String(),
      }),
    },
  );
