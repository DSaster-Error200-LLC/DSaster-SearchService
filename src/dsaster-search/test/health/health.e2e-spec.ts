import type { Server } from "node:http";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

import { createTestApp } from "@test/utils/create-test-app.js";

describe("GET /health (e2e)", () => {
  let app: INestApplication<Server>;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns ok status", async () => {
    const res = await http().get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
