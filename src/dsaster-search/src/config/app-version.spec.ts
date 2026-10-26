import { getAppVersion } from "./app-version.js";

const gitVersion = () => "1.1.0-dev.4";

describe("getAppVersion", () => {
  it("returns APP_VERSION when it is set", () => {
    expect(getAppVersion({ APP_VERSION: "1.2.0" }, gitVersion)).toBe("1.2.0");
  });

  it("uses APP_VERSION in production", () => {
    expect(
      getAppVersion(
        { APP_VERSION: "1.2.0", NODE_ENV: "production" },
        gitVersion,
      ),
    ).toBe("1.2.0");
  });

  it("derives the version from the git tags outside production", () => {
    expect(getAppVersion({}, gitVersion)).toBe("1.1.0-dev.4");
  });

  it("fails in production when APP_VERSION is not set", () => {
    expect(() => getAppVersion({ NODE_ENV: "production" }, gitVersion)).toThrow(
      "APP_VERSION must be defined.",
    );
  });
});
