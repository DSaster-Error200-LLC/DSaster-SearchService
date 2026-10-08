import { createEventRepository } from "./create-event-repository.js";
import { ElasticsearchEventRepository } from "./elasticsearch-event.repository.js";
import { InMemoryEventRepository } from "./in-memory-event.repository.js";

describe("createEventRepository", () => {
  it("keeps events in memory when ELASTICSEARCH_URL is not set", () => {
    expect(createEventRepository({})).toBeInstanceOf(InMemoryEventRepository);
  });

  it("keeps events in memory when ELASTICSEARCH_URL is empty", () => {
    expect(createEventRepository({ ELASTICSEARCH_URL: "" })).toBeInstanceOf(
      InMemoryEventRepository,
    );
  });

  it("stores events in Elasticsearch when ELASTICSEARCH_URL is set", async () => {
    const repository = createEventRepository({
      ELASTICSEARCH_URL: "http://localhost:9200",
    });

    expect(repository).toBeInstanceOf(ElasticsearchEventRepository);
    await (repository as ElasticsearchEventRepository).onModuleDestroy();
  });
});
