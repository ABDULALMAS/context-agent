import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import argon2 from "argon2";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Role } from "@context-bot/core";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
});

const parseRoleArgument = (args: string[]) => {
  const roleIndex = args.indexOf("--role");
  const roleValue = roleIndex >= 0 ? args[roleIndex + 1] : undefined;
  const parsedRole = Role.safeParse(roleValue);

  if (!parsedRole.success) {
    throw new Error("Provide --role ADMIN or --role FOUNDER.");
  }

  return parsedRole.data;
};

const role = parseRoleArgument(process.argv.slice(2));

const { prisma, userRepository } = await import("@context-bot/db");

const readline = createInterface({ input: stdin, output: stdout });

const createUser = async () => {
  try {
    const username = (await readline.question("Username: ")).trim();
    const password = await readline.question("Password: ");

    if (!username || username.length > 50) {
      throw new Error("Username must be between 1 and 50 characters.");
    }

    if (password.length < 8 || password.length > 256) {
      throw new Error("Password must be between 8 and 256 characters.");
    }

    const existingUser = await userRepository.findByUsername(username);

    if (existingUser) {
      throw new Error("Username already exists.");
    }

    const passwordHash = await argon2.hash(password);

    const user = await userRepository.create({
      username,
      passwordHash,
      role,
    });

    console.log(`User "${user.username}" created successfully.`);
  } finally {
    readline.close();
    await prisma.$disconnect();
  }
};

createUser().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Failed to create user.");
  process.exitCode = 1;
});
