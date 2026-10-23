import { toAppVersion } from "./app-version.js";

describe("toAppVersion", () => {
  it("uses the tag on a tagged commit", () => {
    expect(toAppVersion("v1.1.0-0-g7ca152d")).toBe("1.1.0");
  });

  it("adds -dev.N when the commit is N commits past the tag", () => {
    expect(toAppVersion("v1.1.0-4-g7ca152d")).toBe("1.1.0-dev.4");
  });

  it("keeps a pre-release tag", () => {
    expect(toAppVersion("v1.2.0-alpha-0-g7ca152d")).toBe("1.2.0-alpha");
    expect(toAppVersion("v1.2.0-alpha-2-g7ca152d")).toBe("1.2.0-alpha-dev.2");
  });

  it("rejects output that is not a git description", () => {
    expect(() => toAppVersion("7ca152d")).toThrow(
      "Unexpected git describe output",
    );
  });
});
