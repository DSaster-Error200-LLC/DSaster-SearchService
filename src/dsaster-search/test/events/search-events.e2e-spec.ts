import type { Server } from "node:http";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

import {
  eventId,
  eventPreviewJson,
  registerEventBody,
} from "@test/fixtures/event.fixtures.js";
import { createTestApp } from "@test/utils/create-test-app.js";

describe("GET /events (e2e)", () => {
  let app: INestApplication<Server>;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("finds registered events as previews", async () => {
    await http().post(`/events/${eventId}`).send(registerEventBody);
    const res = await http().get("/events").query({ name: "rock" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([eventPreviewJson]);
  });

  it("returns an empty list when the search name is blank", async () => {
    await http().post(`/events/${eventId}`).send(registerEventBody);
    const res = await http().get("/events").query({ name: "   " });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("rejects a search without a name", async () => {
    const res = await http().get("/events");

    expect(res.status).toBe(400);
  });

  it("rejects a search with an empty name", async () => {
    const res = await http().get("/events").query({ name: "" });

    expect(res.status).toBe(400);
  });

  it("rejects a search with unknown query parameters", async () => {
    const res = await http()
      .get("/events")
      .query({ name: "rock", artist: "The Example Band" });

    expect(res.status).toBe(400);
  });
});
