import { db } from "@ingot/db";
import * as schema from "@ingot/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "../auth";

/** Extract session cookies from a Better Auth HTTP response */
const extractCookieHeaders = (response: Response): Headers => {
  const headers = new Headers();
  const setCookies: string[] = [];

  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      const [cookiePair] = value.split(";");
      if (cookiePair) {
        setCookies.push(cookiePair.trim());
      }
    }
  }

  headers.set("cookie", setCookies.join("; "));
  return headers;
};

/** Sign in via Better Auth HTTP handler and return session headers */
const signIn = async ({ email, password }: { email: string; password: string }) => {
  const response = await auth.handler(
    new Request("http://localhost/api/auth/sign-in/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sign-in failed for ${email}: ${body}`);
  }

  return extractCookieHeaders(response);
};

/**
 * Create a test user via Better Auth's HTTP handler and return auth headers.
 * For admin users, updates the role in DB then re-signs in to get fresh session.
 */
export const createTestUser = async ({
  email,
  name,
  password,
  role,
}: {
  email: string;
  name: string;
  password: string;
  role?: "user" | "admin";
}) => {
  const signUpResponse = await auth.handler(
    new Request("http://localhost/api/auth/sign-up/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    })
  );

  if (!signUpResponse.ok) {
    const body = await signUpResponse.text();
    throw new Error(`Failed to create test user ${email}: ${body}`);
  }

  const data = await signUpResponse.json();
  const userId: string = data.user?.id ?? data.id;

  if (!userId) {
    throw new Error(`No user ID returned for ${email}`);
  }

  let headers: Headers;

  if (role && role !== "user") {
    // Update role in DB, then re-sign in for fresh session with new role
    await (db as Parameters<typeof eq>[0] extends never ? never : typeof db)
      .update(schema.users)
      .set({ role })
      .where(eq(schema.users.id, userId));

    headers = await signIn({ email, password });
  } else {
    headers = extractCookieHeaders(signUpResponse);
  }

  return { userId, headers };
};

/** Remove a test user and all associated data (cascades via FK) */
export const cleanupTestUser = async (userId: string) => {
  await (db as Parameters<typeof eq>[0] extends never ? never : typeof db)
    .delete(schema.users)
    .where(eq(schema.users.id, userId));
};

/** Generate a unique email for test isolation */
export const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.local`;
