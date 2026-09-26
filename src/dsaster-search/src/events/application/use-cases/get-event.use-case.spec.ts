import { EventNotFoundError } from "@app/events/domain/errors/event-not-found.error.js";
import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import { event } from "@test/fixtures/event.fixtures.js";
import { GetEventUseCase } from "./get-event.use-case.js";

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
