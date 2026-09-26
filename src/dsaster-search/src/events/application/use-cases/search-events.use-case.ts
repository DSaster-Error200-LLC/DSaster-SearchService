import {
  EventPreview,
  toEventPreview,
} from "@app/events/application/models/event-preview.js";
import { EventRepository } from "@app/events/application/ports/event.repository.js";

export class SearchEventsUseCase {
  constructor(private readonly events: EventRepository) {}

  async execute(name: string): Promise<EventPreview[]> {
    const text = name.trim();
    if (!text) {
      return [];
    }

    const events = await this.events.searchByName(text);
    return events.map(toEventPreview);
  }
}
