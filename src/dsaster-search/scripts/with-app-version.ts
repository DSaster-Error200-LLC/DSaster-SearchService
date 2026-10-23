// Runs a command with APP_VERSION derived from the git tags:
// `jiti scripts/with-app-version.ts nest start`
import { spawn } from "node:child_process";

import { resolveAppVersion } from "./app-version.js";

const command = process.argv.slice(2).join(" ");
if (!command) {
  console.error("Usage: with-app-version <command> [arguments]");
  process.exit(1);
}

// A shell resolves .cmd shims such as `nest` on Windows
const child = spawn(command, {
  shell: true,
  stdio: "inherit",
  env: { ...process.env, APP_VERSION: resolveAppVersion() },
});

// Ctrl+C reaches the child too: wait for it to exit instead of exiting first
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => undefined);
}

child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
