/**
 * Utility type to extract object property values
 * Useful for creating type-safe constants
 */
export type ObjectProperties<T> = T[keyof T];
