import { Elysia, t } from "elysia";
import { db } from "@interviews-tool/db";
import { companyDetails, type NewCompanyDetails } from "@interviews-tool/db/schema/company-details";
import { hiringProcess } from "@interviews-tool/db/schema/hiring-process";
import { eq, and } from "drizzle-orm";
import { auth } from "@interviews-tool/auth";
import { UnauthorizedError, NotFoundError, ConflictError } from "../utils/errors";

// Helper to get user from session
async function getUserFromRequest(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }
  return { id: session.user.id };
}

export const companyDetailsRoutes = new Elysia({
  prefix: "/api/hiring-processes/:id/company-details",
})
  .error({
    UnauthorizedError,
    NotFoundError,
    ConflictError,
  })
  .onError(({ code, error, set }) => {
    // Handle custom errors with proper status codes
    if (code === "UnauthorizedError" || code === "NotFoundError" || code === "ConflictError") {
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
  // Get company details for interview
  .get(
    "/",
    async ({ request, params }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Verify hiring process exists and belongs to user
      const [hiringProcessRecord] = await db
        .select()
        .from(hiringProcess)
        .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

      if (!hiringProcessRecord) {
        throw new NotFoundError("Hiring process");
      }

      // Get company details (optional - may not exist yet)
      const [result] = await db
        .select()
        .from(companyDetails)
        .where(eq(companyDetails.hiringProcessId, params.id));

      // Return null if company details don't exist (they're optional)
      if (!result) {
        return { data: null };
      }

      return { data: result };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  // Create company details
  .post(
    "/",
    async ({ request, params, body }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Verify hiring process exists and belongs to user
      const [hiringProcessRecord] = await db
        .select()
        .from(hiringProcess)
        .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

      if (!hiringProcessRecord) {
        throw new NotFoundError("Hiring process");
      }

      // Check if company details already exist
      const [existing] = await db
        .select()
        .from(companyDetails)
        .where(eq(companyDetails.hiringProcessId, params.id));

      if (existing) {
        throw new ConflictError("Company details already exist for this hiring process");
      }

      // Generate UUID for new company details
      const id = crypto.randomUUID();

      const newCompanyDetails: NewCompanyDetails = {
        id,
        hiringProcessId: params.id,
        website: body.website,
        location: body.location,
        benefits: body.benefits,
        contactedVia: body.contactedVia,
        contactPerson: body.contactPerson,
        interviewSteps: body.interviewSteps ?? 0,
      };

      const [created] = await db.insert(companyDetails).values(newCompanyDetails).returning();

      return { data: created };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        website: t.Optional(t.String()),
        location: t.Optional(t.String()),
        benefits: t.Optional(t.String()),
        contactedVia: t.Optional(t.String()),
        contactPerson: t.Optional(t.String()),
        interviewSteps: t.Optional(t.Number({ minimum: 0 })),
      }),
    },
  )
  // Update company details
  .put(
    "/",
    async ({ request, params, body }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Verify interview exists and belongs to user
      const [interviewRecord] = await db
        .select()
        .from(interview)
        .where(and(eq(interview.id, params.id), eq(interview.userId, user.id)));

      if (!interviewRecord) {
        throw new NotFoundError("Interview");
      }

      // Check if company details exist
      const [existing] = await db
        .select()
        .from(companyDetails)
        .where(eq(companyDetails.hiringProcessId, params.id));

      if (!existing) {
        throw new NotFoundError("Company details");
      }

      const [updated] = await db
        .update(companyDetails)
        .set({
          website: body.website,
          location: body.location,
          benefits: body.benefits,
          contactedVia: body.contactedVia,
          contactPerson: body.contactPerson,
          interviewSteps: body.interviewSteps,
          updatedAt: new Date(),
        })
        .where(eq(companyDetails.hiringProcessId, params.id))
        .returning();

      return { data: updated };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        website: t.Optional(t.String()),
        location: t.Optional(t.String()),
        benefits: t.Optional(t.String()),
        contactedVia: t.Optional(t.String()),
        contactPerson: t.Optional(t.String()),
        interviewSteps: t.Optional(t.Number({ minimum: 0 })),
      }),
    },
  )
  // Delete company details
  .delete(
    "/",
    async ({ request, params }) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        throw new UnauthorizedError();
      }

      // Verify hiring process exists and belongs to user
      const [hiringProcessRecord] = await db
        .select()
        .from(hiringProcess)
        .where(and(eq(hiringProcess.id, params.id), eq(hiringProcess.userId, user.id)));

      if (!hiringProcessRecord) {
        throw new NotFoundError("Hiring process");
      }

      // Check if company details exist
      const [existing] = await db
        .select()
        .from(companyDetails)
        .where(eq(companyDetails.hiringProcessId, params.id));

      if (!existing) {
        throw new NotFoundError("Company details");
      }

      await db.delete(companyDetails).where(eq(companyDetails.hiringProcessId, params.id));

      return { message: "Company details deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
