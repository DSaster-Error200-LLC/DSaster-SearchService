import type { EventPreview } from "@app/events/application/models/event-preview.js";
import type { Event } from "@app/events/domain/entities/event.js";

export const eventId = "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11";

export const event: Event = {
  id: eventId,
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

export const eventPreview: EventPreview = {
  id: event.id,
  name: event.name,
  artist: event.artist,
  date: event.date,
  venueName: event.venue.name,
};

export const registerEventInput = {
  name: event.name,
  artist: event.artist,
  date: event.date,
  venue: event.venue,
};

export const registerEventBody = {
  ...registerEventInput,
  date: "2026-10-10T20:00:00Z",
};

export const eventJson = { ...event, date: event.date.toISOString() };

export const eventPreviewJson = {
  ...eventPreview,
  date: event.date.toISOString(),
};
