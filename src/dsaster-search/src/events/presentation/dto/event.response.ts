import { ApiProperty, ApiSchema } from "@nestjs/swagger";

import type {
  EventDetails,
  VenueDetails,
} from "@app/events/application/event-details.js";

@ApiSchema({ name: "Venue" })
export class VenueResponse implements VenueDetails {
  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;
}

@ApiSchema({ name: "Event" })
export class EventResponse implements EventDetails {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  artist: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  venue: VenueResponse;
}
