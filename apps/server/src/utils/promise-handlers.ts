import type { Result } from "@interviews-tool/domain/types";
import { tryCatch, isFailure } from "@interviews-tool/domain/types";
import { InternalServerError, NotFoundError, BadRequestError } from "./errors";

/**
 * Promise Handler Utilities
 *
 * Provides convenient wrappers for common promise patterns
 * with automatic error handling using the Result type pattern.
 */

/**
 * Executes a database query and handles the result automatically
 *
 * This is a convenience wrapper that combines `tryCatch` with error handling
 * for database queries. It automatically converts database errors into
 * appropriate domain errors.
 *
 * @template T - The type of data returned from the query
 *
 * @param queryPromise - The database query promise
 * @param notFoundMessage - Optional message if no results found
 * @returns The query result data
 * @throws {NotFoundError} If no results found
 * @throws {InternalServerError} If there's a database error
 *
 * @example
 * ```typescript
 * const user = await handleDatabaseQuery(
 *   db.select().from(users).where(eq(users.id, userId)).limit(1),
 *   "User not found"
 * );
 * ```
 */
export async function handleDatabaseQuery<T>(
  queryPromise: Promise<T[]>,
  notFoundMessage: string = "Resource not found",
): Promise<T> {
  const result = await tryCatch(queryPromise);

  if (isFailure(result)) {
    throw new InternalServerError(`Database error: ${result.error.message}`);
  }

  const data = result.data;
  if (!data || data.length === 0) {
    throw new NotFoundError(notFoundMessage);
  }

  return data[0];
}

/**
 * Executes a database list query and handles the result automatically
 *
 * For list queries, an empty array is a valid result, so we don't throw
 * an error if the list is empty. Only throws on actual database errors.
 *
 * @template T - The type of items in the list
 *
 * @param queryPromise - The database query promise
 * @returns The array of items (may be empty)
 * @throws {InternalServerError} If there's a database error
 *
 * @example
 * ```typescript
 * const users = await handleDatabaseListQuery(
 *   db.select().from(users).where(eq(users.status, "active"))
 * );
 * ```
 */
export async function handleDatabaseListQuery<T>(queryPromise: Promise<T[]>): Promise<T[]> {
  const result = await tryCatch(queryPromise);

  if (isFailure(result)) {
    throw new InternalServerError(`Database error: ${result.error.message}`);
  }

  return result.data || [];
}

/**
 * Executes a database mutation and handles the result automatically
 *
 * For mutations (insert, update, delete), we check if rows were affected
 * and throw an error if the operation didn't affect any rows.
 *
 * @template T - The type of data returned from the mutation
 *
 * @param mutationPromise - The database mutation promise
 * @param notFoundMessage - Optional message if no rows were affected
 * @returns The mutation result data
 * @throws {NotFoundError} If no rows were affected
 * @throws {InternalServerError} If there's a database error
 *
 * @example
 * ```typescript
 * const updated = await handleDatabaseMutation(
 *   db.update(users)
 *     .set({ name: "John" })
 *     .where(eq(users.id, userId))
 *     .returning(),
 *   "User not found"
 * );
 * ```
 */
export async function handleDatabaseMutation<T>(
  mutationPromise: Promise<T[]>,
  notFoundMessage: string = "Resource not found",
): Promise<T> {
  const result = await tryCatch(mutationPromise);

  if (isFailure(result)) {
    throw new InternalServerError(`Database error: ${result.error.message}`);
  }

  const data = result.data;
  if (!data || data.length === 0) {
    throw new NotFoundError(notFoundMessage);
  }

  return data[0];
}

/**
 * Executes a promise with validation error handling
 *
 * Useful for operations that might throw validation errors that should
 * be converted to BadRequestError instead of InternalServerError.
 *
 * @template T - The type of data returned
 *
 * @param promise - The promise to execute
 * @param validationErrorClass - The class of validation errors to catch
 * @returns The promise result
 * @throws {BadRequestError} If a validation error occurs
 * @throws {InternalServerError} If any other error occurs
 *
 * @example
 * ```typescript
 * const validated = await handleValidationPromise(
 *   validateUserInput(input),
 *   ValidationError
 * );
 * ```
 */
export async function handleValidationPromise<T>(
  promise: Promise<T>,
  validationErrorClass: new (...args: any[]) => Error = Error,
): Promise<T> {
  const result = await tryCatch(promise);

  if (isFailure(result)) {
    if (result.error instanceof validationErrorClass) {
      throw new BadRequestError(result.error.message);
    }
    throw new InternalServerError(result.error.message);
  }

  return result.data;
}

/**
 * Executes multiple promises in parallel and handles all results
 *
 * Useful for executing multiple independent operations in parallel
 * and handling all errors consistently.
 *
 * @template T - The type of data returned from each promise
 *
 * @param promises - Array of promises to execute
 * @returns Array of results in the same order as input promises
 * @throws {InternalServerError} If any promise fails
 *
 * @example
 * ```typescript
 * const [user, profile] = await handleParallelPromises([
 *   db.select().from(users).where(eq(users.id, userId)),
 *   db.select().from(profiles).where(eq(profiles.userId, userId)),
 * ]);
 * ```
 */
export async function handleParallelPromises<T>(promises: Promise<T>[]): Promise<T[]> {
  const results = await Promise.all(promises.map((promise) => tryCatch(promise)));

  const errors = results
    .filter(isFailure)
    .map((result) => result.error.message)
    .join(", ");

  if (errors) {
    throw new InternalServerError(`Multiple errors: ${errors}`);
  }

  return results.map((result) => {
    if (isFailure(result)) {
      throw new InternalServerError("Unexpected error in parallel execution");
    }
    return result.data;
  });
}
