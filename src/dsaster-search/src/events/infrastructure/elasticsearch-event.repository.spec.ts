import { errors } from "@elastic/elasticsearch";
import type { Client } from "@elastic/elasticsearch";

import { event } from "@test/fixtures/event.fixtures.js";
import {
  ElasticsearchEventRepository,
  EVENTS_INDEX,
} from "./elasticsearch-event.repository.js";
import { toEventDocument } from "./event-document.js";

function createFakeClient() {
  return {
    indices: { exists: vi.fn(), create: vi.fn() },
    index: vi.fn(),
    get: vi.fn(),
    search: vi.fn(),
    close: vi.fn(),
  };
}

function responseError(type: string): errors.ResponseError {
  return new errors.ResponseError({
    body: { error: { type } },
    statusCode: 400,
  } as never);
}

const document = toEventDocument(event, new Date("2026-10-01T12:00:00Z"));

describe("ElasticsearchEventRepository", () => {
  let client: ReturnType<typeof createFakeClient>;
  let repository: ElasticsearchEventRepository;

  beforeEach(() => {
    client = createFakeClient();
    repository = new ElasticsearchEventRepository(client as unknown as Client);
  });

  describe("onModuleInit", () => {
    it("creates the events index when it does not exist", async () => {
      client.indices.exists.mockResolvedValue(false);

      await repository.onModuleInit();

      expect(client.indices.create).toHaveBeenCalledWith(
        expect.objectContaining({ index: EVENTS_INDEX }),
      );
    });

    it("keeps the events index when it already exists", async () => {
      client.indices.exists.mockResolvedValue(true);

      await repository.onModuleInit();

      expect(client.indices.create).not.toHaveBeenCalled();
    });

    it("ignores an index created by another instance in the meantime", async () => {
      client.indices.exists.mockResolvedValue(false);
      client.indices.create.mockRejectedValue(
        responseError("resource_already_exists_exception"),
      );

      await expect(repository.onModuleInit()).resolves.toBeUndefined();
    });

    it("fails when the index cannot be created", async () => {
      const error = responseError("illegal_argument_exception");
      client.indices.exists.mockResolvedValue(false);
      client.indices.create.mockRejectedValue(error);

      await expect(repository.onModuleInit()).rejects.toBe(error);
    });
  });

  it("closes the client on shutdown", async () => {
    await repository.onModuleDestroy();

    expect(client.close).toHaveBeenCalled();
  });

  it("indexes an event under its id and waits until searches can see it", async () => {
    await repository.save(event);

    expect(client.index).toHaveBeenCalledWith(
      expect.objectContaining({
        index: EVENTS_INDEX,
        id: event.id,
        document: expect.objectContaining({
          id: event.id,
          name: event.name,
          date: event.date.toISOString(),
          venue: event.venue,
        }) as unknown,
        refresh: "wait_for",
      }),
    );
  });

  it("finds a saved event by id", async () => {
    client.get.mockResolvedValue({ found: true, _source: document });

    expect(await repository.findById(event.id)).toEqual(event);
    expect(client.get).toHaveBeenCalledWith(
      { index: EVENTS_INDEX, id: event.id },
      { ignore: [404] },
    );
  });

  it("returns undefined for an id that was never saved", async () => {
    client.get.mockResolvedValue({ found: false });

    expect(await repository.findById(event.id)).toBeUndefined();
  });

  it("searches events whose name contains the text, ignoring case", async () => {
    client.search.mockResolvedValue({
      hits: { hits: [{ _source: document }] },
    });

    expect(await repository.searchByName("ROCK")).toEqual([event]);
    expect(client.search).toHaveBeenCalledWith(
      expect.objectContaining({
        index: EVENTS_INDEX,
        query: {
          wildcard: { name: { value: "*ROCK*", case_insensitive: true } },
        },
        sort: [{ registeredAt: "asc" }, { id: "asc" }],
      }),
    );
  });

  it("matches wildcard characters in the text literally", async () => {
    client.search.mockResolvedValue({ hits: { hits: [] } });

    await repository.searchByName(String.raw`a*b?c\d`);

    expect(client.search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: {
          wildcard: {
            name: {
              value: String.raw`*a\*b\?c\\d*`,
              case_insensitive: true,
            },
          },
        },
      }),
    );
  });
});
