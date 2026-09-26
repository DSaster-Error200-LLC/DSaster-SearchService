import { ApiProperty, ApiSchema } from "@nestjs/swagger";

import type { VenueDetails } from "@app/events/application/models/venue-details.js";

@ApiSchema({ name: "Venue" })
export class VenueResponse implements VenueDetails {
  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;
}
