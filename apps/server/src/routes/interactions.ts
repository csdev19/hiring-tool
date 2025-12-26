import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db/client";
import { interaction, type NewInteraction } from "@interviews-tool/db/schema/interaction";
import { hiringProcess } from "@interviews-tool/db/schema/hiring-process";
import { eq, and, desc } from "drizzle-orm";
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
      .from()
      .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

    if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

    const interactions = await db
      .select()
      .from(interaction)
      .where(eq(interaction.hiringProcessId, params.id))
      .orderBy(desc(interaction.createdAt));

    // Always return an array, even if empty
    return successBody(interactions || []);
  })
  // Create interaction
  .post("/", async ({ request, params, body, status }) => {
    const user = await getUserFromRequest(request);
    if (!user) throw new UnauthorizedError();

    const [hiringProcessRecord] = await db
      .select()
      .from(hiringProcess)
      .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

    if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

    const id = crypto.randomUUID();
    const newInteraction: NewInteraction = {
      id,
      hiringProcessId: params.id,
      title: body.title,
      content: body.content,
      type: body.type,
    };

    const [created] = await db.insert(interaction).values(newInteraction).returning();
    return status(201, createdBody(created));
  }, {
    body: createInteractionSchema,
  })
  // Update interaction
  .put("/:interactionId", async ({ request, params, body }) => {
    const user = await getUserFromRequest(request);
    if (!user) throw new UnauthorizedError();

    const [hiringProcessRecord] = await db
      .select()
      .from(hiringProcess)
      .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

    if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

    const [existing] = await db
      .select()
      .from(interaction)
      .where(eq(interaction.id, params.interactionId));

    if (!existing) throw new NotFoundError("Interaction");

    const [updated] = await db
      .update(interaction)
      .set({
        title: body.title,
        content: body.content,
        type: body.type,
        updatedAt: new Date(),
      })
      .where(eq(interaction.id, params.interactionId))
      .returning();

    return successBody(updated);
  }, {
    params: t.Object({
      id: t.String(),
      interactionId: t.String(),
    }),
    body: updateInteractionSchema,
  })
  // Delete interaction
  .delete("/:interactionId", async ({ request, params, set }) => {
    const user = await getUserFromRequest(request);
    if (!user) throw new UnauthorizedError();

    const [hiringProcessRecord] = await db
      .select()
      .from(hiringProcess)
      .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

    if (!hiringProcessRecord) throw new NotFoundError("Hiring process");

    const [existing] = await db
      .select()
      .from(interaction)
      .where(eq(interaction.id, params.interactionId));

    if (!existing) throw new NotFoundError("Interaction");

    await db.delete(interaction).where(eq(interaction.id, params.interactionId));
    set.status = 204;
  }, {
    params: t.Object({
      id: t.String(),
      interactionId: t.String(),
    }),
  });

