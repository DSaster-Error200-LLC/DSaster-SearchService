import type { Venue } from "@app/events/domain/value-objects/venue.js";

export interface Event {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly date: Date;
  readonly venue: Venue;
}
