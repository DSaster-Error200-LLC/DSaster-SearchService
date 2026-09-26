import type { Venue } from "@app/events/domain/value-objects/venue.js";

export interface VenueDetails {
  readonly name: string;
  readonly location: string;
}

export function toVenueDetails(venue: Venue): VenueDetails {
  return {
    name: venue.name,
    location: venue.location,
  };
}
