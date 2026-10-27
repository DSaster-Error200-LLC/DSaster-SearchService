import { resolveGitVersion } from "./git-version.js";

/**
 * Returns APP_VERSION when it is set, as in the Docker image. Outside
 * production it falls back to the version derived from the git tags; in
 * production the app cannot start without it.
 */
export function getAppVersion(
  env: NodeJS.ProcessEnv = process.env,
  resolveFromGit: () => string = resolveGitVersion,
): string {
  if (env.APP_VERSION) {
    return env.APP_VERSION;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("APP_VERSION must be defined.");
  }

  return resolveFromGit();
}
