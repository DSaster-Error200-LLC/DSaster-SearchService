import type { Event } from "@app/events/domain/entities/event.js";
import { InMemoryEventRepository } from "./in-memory-event.repository.js";

const event: Event = {
  id: "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11",
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

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
