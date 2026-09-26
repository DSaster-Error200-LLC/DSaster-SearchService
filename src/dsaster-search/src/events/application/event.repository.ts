import type { Event } from "@app/events/domain/event.js";

export abstract class EventRepository {
  abstract save(event: Event): Promise<void>;
  abstract findById(id: string): Promise<Event | undefined>;
  abstract searchByName(text: string): Promise<Event[]>;
}
