import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class Venue {
  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;
}

export class Event {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  artist: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  venue: Venue;
}

export class EventPreview {
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

export class RegisterVenueRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;
}

export class RegisterEventRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ type: RegisterVenueRequest })
  @Type(() => RegisterVenueRequest)
  @ValidateNested()
  venue: RegisterVenueRequest;
}

export class FindEventsQuery {
  @ApiProperty({
    description:
      "Text to look for in the event name. The match is case-insensitive, ignores leading and trailing spaces, and succeeds when the event name contains the text",
    example: "rock",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

function toPreview(event: Event): EventPreview {
  return {
    id: event.id,
    name: event.name,
    artist: event.artist,
    date: event.date,
    venueName: event.venue.name,
  };
}

@Injectable()
export class EventsService {
  private readonly events = new Map<string, Event>();

  register(id: string, request: RegisterEventRequest): Event {
    if (this.events.has(id)) {
      throw new ConflictException(`Event ${id} is already registered`);
    }

    const event: Event = { id, ...request };
    this.events.set(id, event);

    return event;
  }

  find(query: FindEventsQuery): EventPreview[] {
    const normalizedName = query.name.toUpperCase().trim();
    if (!normalizedName) {
      return [];
    }

    return [...this.events.values()]
      .filter((event) => event.name.toUpperCase().includes(normalizedName))
      .map(toPreview);
  }

  findOne(id: string): Event {
    const event = this.events.get(id);
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }
}
