import type { Role as CoreRole } from "@context-bot/core";
import type { Role as PrismaRole } from "./generated/prisma/enums.js";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;

type Assert<Value extends true> = Value;

export type RoleValuesAreInSync = Assert<Equal<PrismaRole, CoreRole>>;
