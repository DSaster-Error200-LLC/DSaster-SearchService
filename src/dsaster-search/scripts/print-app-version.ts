// Prints the version derived from the git tags, for example to pass it to
// `docker build --build-arg APP_VERSION=$(pnpm --silent app-version)`
import { resolveGitVersion } from "@app/config/git-version.js";

console.log(resolveGitVersion());
