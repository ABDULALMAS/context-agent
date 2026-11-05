import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
});

const { app } = await import("./app.js");
const { env } = await import("./config/env.js");

app.listen(env.PORT, () => {
  // TODO: Replace with the structured logger when it is available.
  console.log(`API server running on port ${env.PORT}`);
});
