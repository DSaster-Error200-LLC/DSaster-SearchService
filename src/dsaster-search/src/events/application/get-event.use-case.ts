import { EventNotFoundError } from "@app/events/domain/errors.js";
import { EventDetails, toEventDetails } from "./event-details.js";
import { EventRepository } from "./event.repository.js";

export class GetEventUseCase {
  constructor(private readonly events: EventRepository) {}

  async execute(id: string): Promise<EventDetails> {
    const event = await this.events.findById(id);
    if (!event) {
      throw new EventNotFoundError(id);
    }

    return toEventDetails(event);
  }
}
