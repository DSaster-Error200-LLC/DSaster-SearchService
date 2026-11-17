import type { RegisterEventCommand } from "@app/events/application/models/register-event-command.js";
import type { RegisterEventUseCase } from "@app/events/application/use-cases/register-event.use-case.js";
import { EventAlreadyExistsError } from "@app/events/domain/errors/event-already-exists.error.js";

/** The example event BookingService seeds, so search and booking agree on it. */
export const exampleEvents: readonly RegisterEventCommand[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Rock Fest 2026",
    artist: "The Rockers",
    date: new Date("2026-11-20T20:00:00Z"),
    venue: { name: "Estadio Nacional", location: "Ciudad de México" },
  },
];

/**
 * Registers the example events unless the app runs in production. An event
 * that already exists, as in a persistent store, is left as it is.
 */
export async function seedExampleEvents(
  registerEvent: RegisterEventUseCase,
  env: NodeJS.ProcessEnv = process.env,
): Promise<void> {
  if (env.NODE_ENV === "production") {
    return;
  }

  for (const event of exampleEvents) {
    try {
      await registerEvent.execute(event);
    } catch (error) {
      if (!(error instanceof EventAlreadyExistsError)) {
        throw error;
      }
    }
  }
}
