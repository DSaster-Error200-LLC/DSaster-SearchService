import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import { event, eventPreview } from "@test/fixtures/event.fixtures.js";
import { SearchEventsUseCase } from "./search-events.use-case.js";

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

    expect(await searchEvents.execute(" rock ")).toEqual([eventPreview]);
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
