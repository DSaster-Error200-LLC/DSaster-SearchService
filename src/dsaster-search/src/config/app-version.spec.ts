import { getAppVersion } from "./app-version.js";

describe("getAppVersion", () => {
  it("returns APP_VERSION", () => {
    expect(getAppVersion({ APP_VERSION: "1.2.0-dev.3" })).toBe("1.2.0-dev.3");
  });

  it("fails when APP_VERSION is not set", () => {
    expect(() => getAppVersion({})).toThrow("APP_VERSION must be defined");
  });
});
