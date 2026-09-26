import { Module } from "@nestjs/common";

import { EventRepository } from "./application/ports/event.repository.js";
import { GetEventUseCase } from "./application/use-cases/get-event.use-case.js";
import { RegisterEventUseCase } from "./application/use-cases/register-event.use-case.js";
import { SearchEventsUseCase } from "./application/use-cases/search-events.use-case.js";
import { InMemoryEventRepository } from "./infrastructure/in-memory-event.repository.js";
import { EventsController } from "./presentation/events.controller.js";

@Module({
  controllers: [EventsController],
  providers: [
    { provide: EventRepository, useClass: InMemoryEventRepository },
    {
      provide: SearchEventsUseCase,
      useFactory: (events: EventRepository) => new SearchEventsUseCase(events),
      inject: [EventRepository],
    },
    {
      provide: RegisterEventUseCase,
      useFactory: (events: EventRepository) => new RegisterEventUseCase(events),
      inject: [EventRepository],
    },
    {
      provide: GetEventUseCase,
      useFactory: (events: EventRepository) => new GetEventUseCase(events),
      inject: [EventRepository],
    },
  ],
})
export class EventsModule {}
