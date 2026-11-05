import { z } from "zod";

import { Role } from "./roles.js";

export const LoginRequest = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(256),
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const AuthUser = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: Role,
});
export type AuthUser = z.infer<typeof AuthUser>;

export const LoginResponse = z.object({
  user: AuthUser,
});
export type LoginResponse = z.infer<typeof LoginResponse>;

export const MeResponse = z.object({
  user: AuthUser,
});
export type MeResponse = z.infer<typeof MeResponse>;

export const LogoutResponse = z.object({
  message: z.string(),
});
export type LogoutResponse = z.infer<typeof LogoutResponse>;
