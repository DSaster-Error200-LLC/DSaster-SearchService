import { EventAlreadyExistsError } from "@app/events/domain/errors/event-already-exists.error.js";
import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import { event } from "@test/fixtures/event.fixtures.js";
import { RegisterEventUseCase } from "./register-event.use-case.js";

describe("RegisterEventUseCase", () => {
  let repository: InMemoryEventRepository;
  let registerEvent: RegisterEventUseCase;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    registerEvent = new RegisterEventUseCase(repository);
  });

  it("returns the details of the registered event", async () => {
    expect(await registerEvent.execute(event)).toEqual(event);
  });

  it("stores the registered event", async () => {
    await registerEvent.execute(event);

    expect(await repository.findById(event.id)).toEqual(event);
  });

  it("rejects registering the same id twice", async () => {
    await registerEvent.execute(event);

    await expect(registerEvent.execute(event)).rejects.toThrow(
      EventAlreadyExistsError,
    );
  });
});
