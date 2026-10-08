import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { errors } from "@elastic/elasticsearch";
import type { Client, estypes } from "@elastic/elasticsearch";

import { EventRepository } from "@app/events/application/ports/event.repository.js";
import type { Event } from "@app/events/domain/entities/event.js";
import { EventDocument, toEvent, toEventDocument } from "./event-document.js";

export const EVENTS_INDEX = "events";

// Elasticsearch's default index.max_result_window
const MAX_RESULTS = 10_000;

const EVENT_MAPPINGS: estypes.MappingTypeMapping = {
  properties: {
    id: { type: "keyword" },
    name: { type: "keyword" },
    artist: { type: "keyword" },
    date: { type: "date" },
    venue: {
      properties: {
        name: { type: "keyword" },
        location: { type: "keyword" },
      },
    },
  },
};

export class ElasticsearchEventRepository
  implements EventRepository, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly client: Client,
    private readonly index = EVENTS_INDEX,
  ) {}

  async onModuleInit(): Promise<void> {
    if (await this.client.indices.exists({ index: this.index })) {
      return;
    }

    try {
      await this.client.indices.create({
        index: this.index,
        mappings: EVENT_MAPPINGS,
      });
    } catch (error) {
      // Another instance created the index between the check and the create
      if (!isIndexAlreadyCreated(error)) {
        throw error;
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  async save(event: Event): Promise<void> {
    await this.client.index({
      index: this.index,
      id: event.id,
      document: toEventDocument(event),
      // A registered event must show up in the next search
      refresh: "wait_for",
    });
  }

  async findById(id: string): Promise<Event | undefined> {
    const result = await this.client.get<EventDocument>(
      { index: this.index, id },
      { ignore: [404] },
    );

    return result.found && result._source ? toEvent(result._source) : undefined;
  }

  async searchByName(text: string): Promise<Event[]> {
    const result = await this.client.search<EventDocument>({
      index: this.index,
      size: MAX_RESULTS,
      query: {
        wildcard: {
          name: { value: `*${escapeWildcard(text)}*`, case_insensitive: true },
        },
      },
      sort: [{ date: "asc" }, { id: "asc" }],
    });

    return result.hits.hits.flatMap((hit) =>
      hit._source ? [toEvent(hit._source)] : [],
    );
  }
}

// Makes * and ? match themselves instead of acting as wildcards
function escapeWildcard(text: string): string {
  return text.replace(/[\\*?]/g, String.raw`\$&`);
}

function isIndexAlreadyCreated(error: unknown): boolean {
  return (
    error instanceof errors.ResponseError &&
    error.message.startsWith("resource_already_exists_exception")
  );
}
