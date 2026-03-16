import type { FieldValues, ResolverResult } from "react-hook-form";

// Reference: https://react-hook-form.com/docs/useform#resolver

type SafeParseResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        issues: { path: PropertyKey[]; message: string }[];
      };
    };

/**
 * Minimal Zod resolver for react-hook-form, compatible with Zod v4.
 * Avoids @hookform/resolvers dependency which may not support Zod v4.
 */
export const zodFormResolver =
  <T extends FieldValues>(schema: {
    safeParseAsync: (data: unknown) => Promise<SafeParseResult<T>>;
  }) =>
  async (values: T): Promise<ResolverResult<T>> => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      } as ResolverResult<T>;
    }

    const errors: Record<string, { type: string; message: string }> = {};

    for (const issue of result.error.issues) {
      const [key] = issue.path;
      if (key !== undefined && !errors[String(key)]) {
        errors[String(key)] = {
          type: "validation",
          message: issue.message,
        };
      }
    }

    return {
      values: {} as T,
      errors,
    } as ResolverResult<T>;
  };
