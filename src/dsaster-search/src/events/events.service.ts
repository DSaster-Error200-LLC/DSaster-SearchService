import { ConflictException, Injectable } from "@nestjs/common";
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
  @IsString()
  @IsNotEmpty()
  name: string;
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

  find(query: FindEventsQuery): Event[] {
    const normalizedName = query.name.toUpperCase().trim();
    if (!normalizedName) {
      return [];
    }

    return [...this.events.values()].filter((event) =>
      event.name.toUpperCase().includes(normalizedName),
    );
  }
}
