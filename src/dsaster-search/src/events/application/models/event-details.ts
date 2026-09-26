import type { Event } from "@app/events/domain/entities/event.js";
import { toVenueDetails, VenueDetails } from "./venue-details.js";

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
    venue: toVenueDetails(event.venue),
  };
}
