/**
 * Returns the app version from APP_VERSION. The app cannot start without it:
 * `pnpm dev` and `pnpm start` derive it from the git tags, and the Docker image
 * takes it as a build argument.
 */
export function getAppVersion(env: NodeJS.ProcessEnv = process.env): string {
  const version = env.APP_VERSION;
  if (!version) {
    throw new Error(
      "APP_VERSION must be defined. Run the app with `pnpm dev` or `pnpm start`, which derive it from the git tags.",
    );
  }

  return version;
}
