import { EventAlreadyExistsError } from "@app/events/domain/errors.js";
import { InMemoryEventRepository } from "@app/events/infrastructure/in-memory-event.repository.js";
import {
  RegisterEventCommand,
  RegisterEventUseCase,
} from "./register-event.use-case.js";

const command: RegisterEventCommand = {
  id: "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11",
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

describe("RegisterEventUseCase", () => {
  let repository: InMemoryEventRepository;
  let registerEvent: RegisterEventUseCase;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    registerEvent = new RegisterEventUseCase(repository);
  });

  it("returns the details of the registered event", async () => {
    expect(await registerEvent.execute(command)).toEqual(command);
  });

  it("stores the registered event", async () => {
    await registerEvent.execute(command);

    expect(await repository.findById(command.id)).toEqual(command);
  });

  it("rejects registering the same id twice", async () => {
    await registerEvent.execute(command);

    await expect(registerEvent.execute(command)).rejects.toThrow(
      EventAlreadyExistsError,
    );
  });
});
