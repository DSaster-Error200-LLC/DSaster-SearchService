import { Client } from "@elastic/elasticsearch";

import { EventRepository } from "@app/events/application/ports/event.repository.js";
import { ElasticsearchEventRepository } from "./elasticsearch-event.repository.js";
import { InMemoryEventRepository } from "./in-memory-event.repository.js";

/**
 * Stores events in Elasticsearch when ELASTICSEARCH_URL is set, and in memory
 * otherwise.
 */
export function createEventRepository(
  env: NodeJS.ProcessEnv = process.env,
): EventRepository {
  const url = env.ELASTICSEARCH_URL;
  if (!url) {
    return new InMemoryEventRepository();
  }

  return new ElasticsearchEventRepository(new Client({ node: url }));
}
