import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import {
  Event,
  EventsService,
  FindEventsQuery,
  RegisterEventRequest,
} from "./events.service.js";

@Controller("events")
@ApiTags("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiQuery({
    name: "name",
    required: true,
    type: String,
  })
  @ApiOkResponse({ type: Event, isArray: true })
  find(@Query() query: FindEventsQuery): Event[] {
    return this.eventsService.find(query);
  }

  @Post(":eventId")
  @ApiOperation({
    summary: "Register an event so it appears in search results",
  })
  @ApiParam({ name: "eventId", type: String, format: "uuid" })
  @ApiCreatedResponse({ type: Event })
  @ApiBadRequestResponse({ description: "Invalid event id or body" })
  @ApiConflictResponse({ description: "Event id is already registered" })
  register(
    @Param("eventId", new ParseUUIDPipe()) eventId: string,
    @Body() body: RegisterEventRequest,
  ): Event {
    return this.eventsService.register(eventId, body);
  }
}
