import type { Event } from "@app/events/domain/event.js";

export interface EventPreview {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly date: Date;
  readonly venueName: string;
}

export function toEventPreview(event: Event): EventPreview {
  return {
    id: event.id,
    name: event.name,
    artist: event.artist,
    date: event.date,
    venueName: event.venue.name,
  };
}
