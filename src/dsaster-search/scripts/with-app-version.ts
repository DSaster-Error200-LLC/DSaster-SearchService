// Runs a command with APP_VERSION derived from the git tags, for
// `pnpm compose`: the dsaster-search image takes it as a build argument
import { spawn } from "node:child_process";

import { resolveGitVersion } from "@app/config/git-version.js";

const command = process.argv.slice(2).join(" ");
if (!command) {
  console.error("Usage: with-app-version <command> [arguments]");
  process.exit(1);
}

// A shell resolves .cmd shims on Windows
const child = spawn(command, {
  shell: true,
  stdio: "inherit",
  env: { ...process.env, APP_VERSION: resolveGitVersion() },
});

// Ctrl+C reaches the child too: wait for it to exit instead of exiting first
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => undefined);
}

child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
