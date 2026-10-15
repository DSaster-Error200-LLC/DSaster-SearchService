import { BadRequestException } from "@nestjs/common";
import { ParseGuidPipe } from "./parse-guid.pipe.js";

describe("ParseGuidPipe", () => {
  const pipe = new ParseGuidPipe();

  it("returns a valid GUID unchanged", () => {
    const value = "123e4567-e89b-12d3-a456-426614174000";

    expect(pipe.transform(value)).toBe(value);
  });

  it("rejects values that are not GUIDs", () => {
    expect(() => pipe.transform("not-a-uuid")).toThrow(BadRequestException);
  });
});
