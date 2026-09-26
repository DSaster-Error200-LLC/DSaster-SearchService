import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import { SearchEventsUseCase } from "./search-events.use-case.js";

const event = {
  id: "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11",
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

describe("SearchEventsUseCase", () => {
  let repository: InMemoryEventRepository;
  let searchEvents: SearchEventsUseCase;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    searchEvents = new SearchEventsUseCase(repository);
  });

  it("returns no previews when nothing is registered", async () => {
    expect(await searchEvents.execute("rock")).toEqual([]);
  });

  it("returns matching events as previews with only the venue name", async () => {
    await repository.save(event);

    expect(await searchEvents.execute(" rock ")).toEqual([
      {
        id: event.id,
        name: event.name,
        artist: event.artist,
        date: event.date,
        venueName: event.venue.name,
      },
    ]);
  });

  it("returns no previews when the name does not match", async () => {
    await repository.save(event);

    expect(await searchEvents.execute("jazz")).toEqual([]);
  });

  it("returns no previews when the name is blank", async () => {
    await repository.save(event);

    expect(await searchEvents.execute("   ")).toEqual([]);
  });
});
