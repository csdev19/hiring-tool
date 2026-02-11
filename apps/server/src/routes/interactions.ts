import { Elysia, t } from "elysia";
import { createDatabaseClient } from "@interviews-tool/infra-db/client";
import {
  HiringProcessRepository,
  InteractionRepository,
} from "@interviews-tool/infra-db/repositories";
import { createInteractionSchema, updateInteractionSchema } from "@interviews-tool/domain/schemas";
import {
  listInteractions,
  createInteraction,
  updateInteraction,
  deleteInteraction,
} from "@interviews-tool/application/interactions";
import { NotFoundError } from "../utils/errors";
import { successBody, createdBody } from "../utils/response-helpers";
import { errorHandlerPlugin } from "../utils/error-handler-plugin";
import { env } from "../env";
import { authMacro } from "@/plugins/auth.plugin";

export const interactionRoutes = new Elysia({
  prefix: "/hiring-processes/:id/interactions",
})
  .use(errorHandlerPlugin)
  .decorate("db", createDatabaseClient(env.DATABASE_URL))
  .derive(({ db }) => ({
    hiringProcessRepo: new HiringProcessRepository(db),
    interactionRepo: new InteractionRepository(db),
  }))
  .use(authMacro)
  // List interactions
  .get(
    "/",
    async ({ params, user, hiringProcessRepo, interactionRepo }) => {
      const result = await listInteractions({
        hiringProcessRepo,
        interactionRepo,
        hiringProcessId: params.id,
        userId: user.id,
      });

      if (result.error) {
        throw new NotFoundError("Hiring process");
      }

      return successBody(result.data);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      isAuth: true,
    },
  )
  // Create interaction
  .post(
    "/",
    async ({ params, body, status, user, hiringProcessRepo, interactionRepo }) => {
      const result = await createInteraction({
        hiringProcessRepo,
        interactionRepo,
        hiringProcessId: params.id,
        userId: user.id,
        input: body,
      });

      if (result.error) {
        throw new NotFoundError("Hiring process");
      }

      return status(201, createdBody(result.data));
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: createInteractionSchema,
      isAuth: true,
    },
  )
  // Update interaction
  .put(
    "/:interactionId",
    async ({ params, body, user, hiringProcessRepo, interactionRepo }) => {
      const result = await updateInteraction({
        hiringProcessRepo,
        interactionRepo,
        hiringProcessId: params.id,
        interactionId: params.interactionId,
        userId: user.id,
        input: body,
      });

      if (result.error) {
        if (result.error.message === "Interaction not found") {
          throw new NotFoundError("Interaction");
        }
        throw new NotFoundError("Hiring process");
      }

      return successBody(result.data);
    },
    {
      params: t.Object({
        id: t.String(),
        interactionId: t.String(),
      }),
      body: updateInteractionSchema,
      isAuth: true,
    },
  )
  // Delete interaction
  .delete(
    "/:interactionId",
    async ({ params, status, user, hiringProcessRepo, interactionRepo }) => {
      const result = await deleteInteraction({
        hiringProcessRepo,
        interactionRepo,
        hiringProcessId: params.id,
        interactionId: params.interactionId,
        userId: user.id,
      });

      if (result.error) {
        if (result.error.message === "Interaction not found") {
          throw new NotFoundError("Interaction");
        }
        throw new NotFoundError("Hiring process");
      }

      return status(204);
    },
    {
      params: t.Object({
        id: t.String(),
        interactionId: t.String(),
      }),
      isAuth: true,
    },
  );
