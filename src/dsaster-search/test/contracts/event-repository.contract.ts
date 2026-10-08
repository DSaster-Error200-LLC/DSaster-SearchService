import type { EventRepository } from "@app/events/application/ports/event.repository.js";
import type { Event } from "@app/events/domain/entities/event.js";
import { event } from "@test/fixtures/event.fixtures.js";

// Its id sorts before `event`'s, so only its later date puts it second
const laterEvent: Event = {
  ...event,
  id: "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
  name: "Rock Night",
  date: new Date("2026-12-01T21:00:00Z"),
};

// Same date as `event`; its id sorts after `event`'s
const sameDateEvent: Event = {
  ...event,
  id: "f1c2d3e4-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
  name: "Rock Encore",
};

const eventWithWildcards: Event = {
  ...event,
  id: "7e3a2b1c-0d9e-4f8a-b7c6-d5e4f3a2b1c0",
  name: "Rock * Special?",
};

/**
 * The behavior every EventRepository implementation must share. Run each check
 * against an empty repository:
 *
 *   it.each(eventRepositoryContract)("$name", ({ check }) => check(repository));
 */
export const eventRepositoryContract: {
  name: string;
  check: (repository: EventRepository) => Promise<void>;
}[] = [
  {
    name: "returns undefined for an id that was never saved",
    check: async (repository) => {
      expect(await repository.findById(event.id)).toBeUndefined();
    },
  },
  {
    name: "finds a saved event by id",
    check: async (repository) => {
      await repository.save(event);

      expect(await repository.findById(event.id)).toEqual(event);
    },
  },
  {
    name: "searches events whose name contains the text, ignoring case",
    check: async (repository) => {
      await repository.save(event);

      expect(await repository.searchByName("ROCK")).toEqual([event]);
      expect(await repository.searchByName("concert")).toEqual([event]);
    },
  },
  {
    name: "returns no events when no name contains the text",
    check: async (repository) => {
      await repository.save(event);

      expect(await repository.searchByName("jazz")).toEqual([]);
    },
  },
  {
    name: "sorts matching events by date, earliest first",
    check: async (repository) => {
      await repository.save(laterEvent);
      await repository.save(event);

      expect(await repository.searchByName("rock")).toEqual([
        event,
        laterEvent,
      ]);
    },
  },
  {
    name: "sorts events with the same date by id",
    check: async (repository) => {
      await repository.save(sameDateEvent);
      await repository.save(event);

      expect(await repository.searchByName("rock")).toEqual([
        event,
        sameDateEvent,
      ]);
    },
  },
  {
    name: "matches wildcard characters in the text literally",
    check: async (repository) => {
      await repository.save(event);
      await repository.save(eventWithWildcards);

      expect(await repository.searchByName("*")).toEqual([eventWithWildcards]);
      expect(await repository.searchByName("?")).toEqual([eventWithWildcards]);
    },
  },
];
