import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "@app/app.module.js";
import { createOpenApiDocument } from "@app/config/openapi.js";

const app = await NestFactory.create(AppModule);

try {
  const document = createOpenApiDocument(app);
  const outputDirectory = resolve("openapi");
  const fileName = process.argv[2] ?? "openapi.json";
  const outputPath = resolve(outputDirectory, fileName);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`);
} finally {
  await app.close();
}
