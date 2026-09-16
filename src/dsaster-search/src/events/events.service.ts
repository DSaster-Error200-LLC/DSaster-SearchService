import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

export class Venue {
  @ApiProperty()
  name: string;
}

export class Event {
  @ApiProperty()
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

export class FindEventsQuery {
  @IsString()
  @IsNotEmpty()
  name: string;
}

@Injectable()
export class EventsService {
  // TODO: Remove the hardcoded events
  private readonly events: Event[] = [
    {
      id: "1",
      name: "Rock Concert",
      artist: "The Example Band",
      date: new Date("2026-10-10T20:00:00Z"),
      venue: {
        name: "Central Arena",
      },
    },
    {
      id: "2",
      name: "Jazz Night",
      artist: "Example Jazz",
      date: new Date("2026-11-05T21:00:00Z"),
      venue: {
        name: "Blue Room",
      },
    },
    {
      id: "3",
      name: "Pop Festival",
      artist: "Pop Stars",
      date: new Date("2026-12-15T18:00:00Z"),
      venue: {
        name: "Green Field",
      },
    },
  ];

  find(query: FindEventsQuery): Event[] {
    const normalizedName = query.name.toUpperCase().trim();
    if (!normalizedName) {
      return [];
    }

    return this.events.filter((event) =>
      event.name.toUpperCase().includes(normalizedName),
    );
  }
}
