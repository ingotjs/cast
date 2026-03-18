// Reference: https://orm.drizzle.team/docs/zod

import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { accounts, passkeys, sessions, users, verifications } from "./auth-schema";

// Users
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
export const updateUserSchema = createUpdateSchema(users);

// Sessions
export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);

// Accounts
export const selectAccountSchema = createSelectSchema(accounts);
export const insertAccountSchema = createInsertSchema(accounts);

// Verifications
export const selectVerificationSchema = createSelectSchema(verifications);
export const insertVerificationSchema = createInsertSchema(verifications);

// Passkeys
export const selectPasskeySchema = createSelectSchema(passkeys);
export const insertPasskeySchema = createInsertSchema(passkeys);
