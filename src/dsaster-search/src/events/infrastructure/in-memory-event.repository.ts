import { EventRepository } from "@app/events/application/ports/event.repository.js";
import type { Event } from "@app/events/domain/entities/event.js";

export class InMemoryEventRepository implements EventRepository {
  private readonly events = new Map<string, Event>();

  save(event: Event): Promise<void> {
    this.events.set(event.id, event);
    return Promise.resolve();
  }

  findById(id: string): Promise<Event | undefined> {
    return Promise.resolve(this.events.get(id));
  }

  searchByName(text: string): Promise<Event[]> {
    const needle = text.toUpperCase();
    return Promise.resolve(
      [...this.events.values()].filter((event) =>
        event.name.toUpperCase().includes(needle),
      ),
    );
  }
}
