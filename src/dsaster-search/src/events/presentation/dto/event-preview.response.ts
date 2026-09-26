import { ApiProperty, ApiSchema } from "@nestjs/swagger";

import type { EventPreview } from "@app/events/application/models/event-preview.js";

@ApiSchema({ name: "EventPreview" })
export class EventPreviewResponse implements EventPreview {
  @ApiProperty({
    format: "uuid",
    description: "Identifier the event was registered with",
    example: "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11",
  })
  id: string;

  @ApiProperty({ description: "Event name", example: "Rock Concert" })
  name: string;

  @ApiProperty({
    description: "Performing artist",
    example: "The Example Band",
  })
  artist: string;

  @ApiProperty({
    format: "date-time",
    description: "Date and time of the event, in ISO 8601",
    example: "2026-10-10T20:00:00.000Z",
  })
  date: Date;

  @ApiProperty({
    description: "Name of the venue hosting the event",
    example: "Central Arena",
  })
  venueName: string;
}
