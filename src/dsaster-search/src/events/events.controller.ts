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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import {
  Event,
  EventPreview,
  EventsService,
  FindEventsQuery,
  RegisterEventRequest,
} from "./events.service.js";

@Controller("events")
@ApiTags("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({
    summary: "Search registered events by name",
    description:
      "Returns a preview of every registered event whose name contains the given text, in registration order.",
  })
  @ApiOkResponse({
    type: EventPreview,
    isArray: true,
    description:
      "Previews of the matching events. The list is empty when no event matches or when the name contains only spaces.",
  })
  @ApiBadRequestResponse({
    description:
      "The name is missing or empty, or the request contains query parameters other than name.",
  })
  find(@Query() query: FindEventsQuery): EventPreview[] {
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

  @Get(":eventId")
  @ApiOperation({ summary: "Get event details by ID" })
  @ApiParam({ name: "eventId", type: String, format: "uuid" })
  @ApiOkResponse({ type: Event })
  @ApiNotFoundResponse({ description: "Event not found" })
  findOne(@Param("eventId", new ParseUUIDPipe()) eventId: string): Event {
    return this.eventsService.findOne(eventId);
  }
}
