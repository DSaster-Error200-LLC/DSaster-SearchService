import { eventRepositoryContract } from "@test/contracts/event-repository.contract.js";
import { InMemoryEventRepository } from "./in-memory-event.repository.js";

describe("InMemoryEventRepository", () => {
  it.each(eventRepositoryContract)("$name", ({ check }) =>
    check(new InMemoryEventRepository()),
  );
});
