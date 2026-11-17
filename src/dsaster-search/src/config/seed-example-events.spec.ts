import { RegisterEventUseCase } from "@app/events/application/use-cases/register-event.use-case.js";
import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import { exampleEvents, seedExampleEvents } from "./seed-example-events.js";

describe("seedExampleEvents", () => {
  let repository: InMemoryEventRepository;
  let registerEvent: RegisterEventUseCase;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    registerEvent = new RegisterEventUseCase(repository);
  });

  it("registers the BookingService example event", async () => {
    await seedExampleEvents(registerEvent, {});

    expect(await repository.findById(exampleEvents[0].id)).toEqual({
      id: "11111111-1111-1111-1111-111111111111",
      name: "Rock Fest 2026",
      artist: "The Rockers",
      date: new Date("2026-11-20T20:00:00Z"),
      venue: { name: "Estadio Nacional", location: "Ciudad de México" },
    });
  });

  it("registers the events in development", async () => {
    await seedExampleEvents(registerEvent, { NODE_ENV: "development" });

    expect(await repository.searchByName("rock")).toHaveLength(1);
  });

  it("does not register any event in production", async () => {
    await seedExampleEvents(registerEvent, { NODE_ENV: "production" });

    expect(await repository.searchByName("rock")).toEqual([]);
  });

  it("keeps an event that already exists, as in a persistent store", async () => {
    await seedExampleEvents(registerEvent, {});
    const saved = await repository.findById(exampleEvents[0].id);

    await seedExampleEvents(registerEvent, {});

    expect(await repository.searchByName("rock")).toEqual([saved]);
  });

  it("fails when an event cannot be registered for another reason", async () => {
    const error = new Error("store unavailable");
    vi.spyOn(repository, "findById").mockRejectedValue(error);

    await expect(seedExampleEvents(registerEvent, {})).rejects.toBe(error);
  });
});
