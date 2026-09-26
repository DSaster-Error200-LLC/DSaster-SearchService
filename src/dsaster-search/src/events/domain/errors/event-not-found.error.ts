export class EventNotFoundError extends Error {
  constructor(readonly eventId: string) {
    super(`Event ${eventId} not found`);
    this.name = "EventNotFoundError";
  }
}
