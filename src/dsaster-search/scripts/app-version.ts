import { execFileSync } from "node:child_process";

// `git describe --long` output: the tag, the commits since it and the commit,
// for example v1.1.0-4-g7ca152d
const GIT_DESCRIPTION = /^v(?<tag>\S+)-(?<commits>\d+)-g[\da-f]+$/;

/**
 * Derives the app version from the latest `vX.Y.Z` tag: `X.Y.Z` on the tagged
 * commit, `X.Y.Z-dev.N` when the commit is N commits past the tag.
 */
export function resolveAppVersion(cwd = process.cwd()): string {
  let description: string;
  try {
    description = execFileSync(
      // eslint-disable-next-line sonarjs/no-os-command-from-path -- dev-time script: the developer's own git
      "git",
      ["describe", "--tags", "--long", "--match", "v[0-9]*"],
      { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    ).trim();
  } catch (error) {
    throw new Error(
      "Cannot derive APP_VERSION: no vX.Y.Z git tag is reachable from HEAD. Fetch the tags (`git fetch --tags`) or set APP_VERSION explicitly.",
      { cause: error },
    );
  }

  return toAppVersion(description);
}

export function toAppVersion(gitDescription: string): string {
  const groups = GIT_DESCRIPTION.exec(gitDescription)?.groups;
  if (!groups) {
    throw new Error(`Unexpected git describe output: ${gitDescription}`);
  }

  const { tag, commits } = groups;
  return commits === "0" ? tag : `${tag}-dev.${commits}`;
}
