export class EventAlreadyExistsError extends Error {
  constructor(readonly eventId: string) {
    super(`Event ${eventId} is already registered`);
    this.name = "EventAlreadyExistsError";
  }
}
