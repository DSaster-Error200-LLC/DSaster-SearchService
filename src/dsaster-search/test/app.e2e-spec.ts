import type { Server } from "node:http";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@app/app.module.js";
import { configureApp } from "@app/configuration.js";

const id = "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11";

const body = {
  name: "Rock Concert",
  artist: "The Example Band",
  date: "2026-10-10T20:00:00Z",
  venue: { name: "Central Arena", location: "Madrid" },
};

describe("Events (e2e)", () => {
  let app: INestApplication<Server>;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("registers an event and finds it in search", async () => {
    const created = await http().post(`/events/${id}`).send(body);
    expect(created.status).toBe(201);

    const res = await http().get("/events").query({ name: "rock" }).expect(200);

    expect(res.body).toEqual([
      {
        id,
        name: body.name,
        artist: body.artist,
        date: "2026-10-10T20:00:00.000Z",
        venueName: body.venue.name,
      },
    ]);
  });

  it("returns an empty list when the search name is blank", async () => {
    await http().post(`/events/${id}`).send(body);
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

  it("rejects an id that is not a guid", async () => {
    const res = await http().post("/events/not-a-guid").send(body);

    expect(res.status).toBe(400);
  });

  it("rejects an invalid body", async () => {
    const res = await http()
      .post(`/events/${id}`)
      .send({ ...body, venue: { name: "Central Arena" } });

    expect(res.status).toBe(400);
  });

  it("rejects registering the same id twice", async () => {
    await http().post(`/events/${id}`).send(body);
    const res = await http().post(`/events/${id}`).send(body);

    expect(res.status).toBe(409);
  });
});
