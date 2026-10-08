import { Client } from "@elastic/elasticsearch";

import { eventRepositoryContract } from "@test/contracts/event-repository.contract.js";
import { ElasticsearchEventRepository } from "./elasticsearch-event.repository.js";

// Runs only when ELASTICSEARCH_URL points at a live Elasticsearch, for example
// `ELASTICSEARCH_URL=http://localhost:9200 pnpm test`
const url = process.env.ELASTICSEARCH_URL;

const index = "events-contract-test";

describe.skipIf(!url)("ElasticsearchEventRepository on Elasticsearch", () => {
  it.each(eventRepositoryContract)("$name", async ({ check }) => {
    const client = new Client({ node: url });
    await client.indices.delete({ index }, { ignore: [404] });

    const repository = new ElasticsearchEventRepository(client, index);
    await repository.onModuleInit();

    try {
      await check(repository);
    } finally {
      await client.indices.delete({ index }, { ignore: [404] });
      await repository.onModuleDestroy();
    }
  });
});
