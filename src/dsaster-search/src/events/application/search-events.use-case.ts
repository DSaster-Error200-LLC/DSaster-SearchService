import { EventPreview, toEventPreview } from "./event-preview.js";
import { EventRepository } from "./event.repository.js";

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
