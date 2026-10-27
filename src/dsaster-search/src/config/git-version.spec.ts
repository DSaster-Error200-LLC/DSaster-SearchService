import { toGitVersion } from "./git-version.js";

describe("toGitVersion", () => {
  it("uses the tag on a tagged commit", () => {
    expect(toGitVersion("v1.1.0-0-g7ca152d")).toBe("1.1.0");
  });

  it("adds -dev.N when the commit is N commits past the tag", () => {
    expect(toGitVersion("v1.1.0-4-g7ca152d")).toBe("1.1.0-dev.4");
  });

  it("keeps a pre-release tag", () => {
    expect(toGitVersion("v1.2.0-alpha-0-g7ca152d")).toBe("1.2.0-alpha");
    expect(toGitVersion("v1.2.0-alpha-2-g7ca152d")).toBe("1.2.0-alpha-dev.2");
  });

  it("rejects output that is not a git description", () => {
    expect(() => toGitVersion("7ca152d")).toThrow(
      "Unexpected git describe output",
    );
  });
});
