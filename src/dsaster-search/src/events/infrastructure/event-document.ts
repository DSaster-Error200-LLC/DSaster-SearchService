import type { Event } from "@app/events/domain/entities/event.js";
import type { VenueDocument } from "./venue-document.js";

export interface EventDocument {
  id: string;
  name: string;
  artist: string;
  date: string;
  venue: VenueDocument;
  registeredAt: string;
}

export function toEventDocument(
  event: Event,
  registeredAt: Date,
): EventDocument {
  return {
    id: event.id,
    name: event.name,
    artist: event.artist,
    date: event.date.toISOString(),
    venue: { name: event.venue.name, location: event.venue.location },
    registeredAt: registeredAt.toISOString(),
  };
}

export function toEvent(document: EventDocument): Event {
  return {
    id: document.id,
    name: document.name,
    artist: document.artist,
    date: new Date(document.date),
    venue: { name: document.venue.name, location: document.venue.location },
  };
}
