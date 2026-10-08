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
      [...this.events.values()]
        .filter((event) => event.name.toUpperCase().includes(needle))
        .sort(byDateThenId),
    );
  }
}

function byDateThenId(a: Event, b: Event): number {
  const byDate = a.date.getTime() - b.date.getTime();
  if (byDate !== 0) {
    return byDate;
  }

  // Code point order, the same order Elasticsearch uses for keyword fields
  if (a.id === b.id) {
    return 0;
  }
  return a.id < b.id ? -1 : 1;
}
