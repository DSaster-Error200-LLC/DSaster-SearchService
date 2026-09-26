import { EventNotFoundError } from "@app/events/domain/errors.js";
import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import { GetEventUseCase } from "./get-event.use-case.js";

const event = {
  id: "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11",
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

describe("GetEventUseCase", () => {
  let repository: InMemoryEventRepository;
  let getEvent: GetEventUseCase;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    getEvent = new GetEventUseCase(repository);
  });

  it("returns the details of an event by id", async () => {
    await repository.save(event);

    expect(await getEvent.execute(event.id)).toEqual(event);
  });

  it("rejects an id that does not exist", async () => {
    await expect(getEvent.execute(event.id)).rejects.toThrow(
      EventNotFoundError,
    );
  });
});
