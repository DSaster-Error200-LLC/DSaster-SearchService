import type { Server } from "node:http";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

import {
  eventId,
  eventJson,
  registerEventBody,
} from "@test/fixtures/event.fixtures.js";
import { createTestApp } from "@test/utils/create-test-app.js";

describe("GET /events/{eventId} (e2e)", () => {
  let app: INestApplication<Server>;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns the full event by id", async () => {
    await http().post(`/events/${eventId}`).send(registerEventBody);
    const res = await http().get(`/events/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(eventJson);
  });

  it("returns 404 when the event does not exist", async () => {
    const res = await http().get(`/events/${eventId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: `Event ${eventId} not found`,
    });
  });

  it("rejects an id that is not a guid", async () => {
    const res = await http().get("/events/not-a-guid");

    expect(res.status).toBe(400);
  });
});
