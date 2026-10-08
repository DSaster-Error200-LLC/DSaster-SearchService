import type { Event } from "@app/events/domain/entities/event.js";

/**
 * Every implementation must pass the shared contract in
 * test/contracts/event-repository.contract.ts.
 */
export abstract class EventRepository {
  /** Stores the event under its id, replacing any event saved with that id. */
  abstract save(event: Event): Promise<void>;

  /** Returns the event saved with this id, or undefined when there is none. */
  abstract findById(id: string): Promise<Event | undefined>;

  /**
   * Returns every event whose name contains the text, ignoring case, sorted by
   * event date (earliest first) and then by id. The text is matched literally,
   * so characters such as `*` or `?` only match themselves.
   */
  abstract searchByName(text: string): Promise<Event[]>;
}
