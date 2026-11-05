import { z } from "zod";

export const Role = z.enum(["ADMIN", "FOUNDER"]);
export type Role = z.infer<typeof Role>;
