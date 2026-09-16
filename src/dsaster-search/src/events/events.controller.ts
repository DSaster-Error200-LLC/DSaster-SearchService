import { Controller, Get, Query } from "@nestjs/common";

import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";

import { Event, EventsService, FindEventsQuery } from "./events.service.js";

@Controller("events")
@ApiTags("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiQuery({
    name: "name",
    required: true,
  })
  @ApiOkResponse({ type: Event, isArray: true })
  find(@Query() query: FindEventsQuery): Event[] {
    return this.eventsService.find(query);
  }
}
