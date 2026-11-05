import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
});

const { app, logger } = await import("./app.js");
const { env } = await import("./config/env.js");

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "API server listening");
});
