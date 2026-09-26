import { event } from "@test/fixtures/event.fixtures.js";
import { InMemoryEventRepository } from "./in-memory-event.repository.js";

describe("InMemoryEventRepository", () => {
  let repository: InMemoryEventRepository;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
  });

  it("returns undefined for an id that was never saved", async () => {
    expect(await repository.findById(event.id)).toBeUndefined();
  });

  it("finds a saved event by id", async () => {
    await repository.save(event);

    expect(await repository.findById(event.id)).toEqual(event);
  });

  it("searches events whose name contains the text, ignoring case", async () => {
    await repository.save(event);

    expect(await repository.searchByName("ROCK")).toEqual([event]);
    expect(await repository.searchByName("concert")).toEqual([event]);
  });

  it("returns no events when no name contains the text", async () => {
    await repository.save(event);

    expect(await repository.searchByName("jazz")).toEqual([]);
  });
});
