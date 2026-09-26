import type { Server } from "node:http";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

import {
  eventId,
  eventJson,
  registerEventBody,
} from "@test/fixtures/event.fixtures.js";
import { createTestApp } from "@test/utils/create-test-app.js";

describe("POST /events/{eventId} (e2e)", () => {
  let app: INestApplication<Server>;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("registers an event and returns it", async () => {
    const res = await http().post(`/events/${eventId}`).send(registerEventBody);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(eventJson);
  });

  it("rejects an id that is not a guid", async () => {
    const res = await http().post("/events/not-a-guid").send(registerEventBody);

    expect(res.status).toBe(400);
  });

  it("rejects an invalid body", async () => {
    const res = await http()
      .post(`/events/${eventId}`)
      .send({ ...registerEventBody, venue: { name: "Central Arena" } });

    expect(res.status).toBe(400);
  });

  it("rejects registering the same id twice", async () => {
    await http().post(`/events/${eventId}`).send(registerEventBody);
    const res = await http().post(`/events/${eventId}`).send(registerEventBody);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      statusCode: 409,
      error: "Conflict",
      message: `Event ${eventId} is already registered`,
    });
  });
});
