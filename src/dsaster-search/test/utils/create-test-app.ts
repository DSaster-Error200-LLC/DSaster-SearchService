import type { Server } from "node:http";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "@app/app.module.js";
import { configureApp } from "@app/config/configuration.js";

export async function createTestApp(): Promise<INestApplication<Server>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<INestApplication<Server>>();
  configureApp(app);
  await app.init();

  return app;
}
