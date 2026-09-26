import type { Event } from "@app/events/domain/entities/event.js";

export interface VenueDetails {
  readonly name: string;
  readonly location: string;
}

export interface EventDetails {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly date: Date;
  readonly venue: VenueDetails;
}

export function toEventDetails(event: Event): EventDetails {
  return {
    id: event.id,
    name: event.name,
    artist: event.artist,
    date: event.date,
    venue: {
      name: event.venue.name,
      location: event.venue.location,
    },
  };
}
