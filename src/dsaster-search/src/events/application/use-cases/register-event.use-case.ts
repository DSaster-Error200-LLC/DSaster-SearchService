import { EventAlreadyExistsError } from "@app/events/domain/errors/event-already-exists.error.js";
import type { Event } from "@app/events/domain/entities/event.js";
import {
  EventDetails,
  toEventDetails,
} from "@app/events/application/models/event-details.js";
import { EventRepository } from "@app/events/application/ports/event.repository.js";

export interface RegisterEventCommand {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly date: Date;
  readonly venue: {
    readonly name: string;
    readonly location: string;
  };
}

export class RegisterEventUseCase {
  constructor(private readonly events: EventRepository) {}

  async execute(command: RegisterEventCommand): Promise<EventDetails> {
    if (await this.events.findById(command.id)) {
      throw new EventAlreadyExistsError(command.id);
    }

    const event: Event = {
      id: command.id,
      name: command.name,
      artist: command.artist,
      date: command.date,
      venue: {
        name: command.venue.name,
        location: command.venue.location,
      },
    };
    await this.events.save(event);

    return toEventDetails(event);
  }
}
