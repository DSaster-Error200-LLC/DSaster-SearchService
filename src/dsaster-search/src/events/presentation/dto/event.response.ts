import { ApiProperty, ApiSchema } from "@nestjs/swagger";

import type { EventDetails } from "@app/events/application/models/event-details.js";
import { VenueResponse } from "./venue.response.js";

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
