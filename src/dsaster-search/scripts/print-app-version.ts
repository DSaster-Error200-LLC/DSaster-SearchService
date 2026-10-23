// Prints the version derived from the git tags, for example to pass it to
// `docker build --build-arg APP_VERSION=$(pnpm --silent app-version)`
import { resolveAppVersion } from "./app-version.js";

console.log(resolveAppVersion());
