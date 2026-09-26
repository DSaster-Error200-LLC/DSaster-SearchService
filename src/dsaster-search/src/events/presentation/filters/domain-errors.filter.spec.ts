import { ConflictException, NotFoundException } from "@nestjs/common";

import { EventAlreadyExistsError } from "@app/events/domain/errors/event-already-exists.error.js";
import { EventNotFoundError } from "@app/events/domain/errors/event-not-found.error.js";
import { eventId as id } from "@test/fixtures/event.fixtures.js";
import { toHttpException } from "./domain-errors.filter.js";

describe("toHttpException", () => {
  it("maps an already registered event to 409 Conflict", () => {
    const exception = toHttpException(new EventAlreadyExistsError(id));

    expect(exception).toBeInstanceOf(ConflictException);
    expect(exception.message).toBe(`Event ${id} is already registered`);
  });

  it("maps a missing event to 404 Not Found", () => {
    const exception = toHttpException(new EventNotFoundError(id));

    expect(exception).toBeInstanceOf(NotFoundException);
    expect(exception.message).toBe(`Event ${id} not found`);
  });
});
