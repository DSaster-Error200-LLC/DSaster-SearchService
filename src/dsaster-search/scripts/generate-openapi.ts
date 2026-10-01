import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { NestFactory } from "@nestjs/core";
import { stringify } from "yaml";

import { AppModule } from "@app/app.module.js";
import { createOpenApiDocument } from "@app/config/openapi.js";

const appVersion = process.env.APP_VERSION;

if (!appVersion) {
  throw new Error("APP_VERSION must be defined");
}

const app = await NestFactory.create(AppModule);

try {
  const document = createOpenApiDocument(app, appVersion);
  const outputPath = resolve("openapi.yml");

  await writeFile(outputPath, stringify(document));
} finally {
  await app.close();
}
