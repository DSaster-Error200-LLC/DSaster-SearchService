import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseFilters,
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

import { GetEventUseCase } from "@app/events/application/get-event.use-case.js";
import { RegisterEventUseCase } from "@app/events/application/register-event.use-case.js";
import { SearchEventsUseCase } from "@app/events/application/search-events.use-case.js";
import { DomainErrorsFilter } from "./domain-errors.filter.js";
import { EventPreviewResponse } from "./dto/event-preview.response.js";
import { EventResponse } from "./dto/event.response.js";
import { FindEventsQuery } from "./dto/find-events.query.js";
import { RegisterEventRequest } from "./dto/register-event.request.js";

@Controller("events")
@ApiTags("events")
@UseFilters(DomainErrorsFilter)
export class EventsController {
  constructor(
    private readonly searchEvents: SearchEventsUseCase,
    private readonly registerEvent: RegisterEventUseCase,
    private readonly getEvent: GetEventUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Search registered events by name",
    description:
      "Returns a preview of every registered event whose name contains the given text, in registration order.",
  })
  @ApiOkResponse({
    type: EventPreviewResponse,
    isArray: true,
    description:
      "Previews of the matching events. The list is empty when no event matches or when the name contains only spaces.",
  })
  @ApiBadRequestResponse({
    description:
      "The name is missing or empty, or the request contains query parameters other than name.",
  })
  find(@Query() query: FindEventsQuery): Promise<EventPreviewResponse[]> {
    return this.searchEvents.execute(query.name);
  }

  @Post(":eventId")
  @ApiOperation({
    summary: "Register an event so it appears in search results",
  })
  @ApiParam({ name: "eventId", type: String, format: "uuid" })
  @ApiCreatedResponse({ type: EventResponse })
  @ApiBadRequestResponse({ description: "Invalid event id or body" })
  @ApiConflictResponse({ description: "Event id is already registered" })
  register(
    @Param("eventId", new ParseUUIDPipe()) eventId: string,
    @Body() body: RegisterEventRequest,
  ): Promise<EventResponse> {
    return this.registerEvent.execute({ ...body, id: eventId });
  }

  @Get(":eventId")
  @ApiOperation({ summary: "Get event details by ID" })
  @ApiParam({ name: "eventId", type: String, format: "uuid" })
  @ApiOkResponse({ type: EventResponse })
  @ApiNotFoundResponse({ description: "Event not found" })
  getDetails(
    @Param("eventId", new ParseUUIDPipe()) eventId: string,
  ): Promise<EventResponse> {
    return this.getEvent.execute(eventId);
  }
}
