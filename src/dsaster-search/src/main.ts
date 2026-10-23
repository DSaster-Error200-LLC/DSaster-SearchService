import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module.js";
import { getAppVersion } from "./config/app-version.js";
import { createOpenApiDocument } from "./config/openapi.js";
import { configureApp } from "./config/configuration.js";

function hyperlink(url: string): string {
  return `\x1b]8;;${url}\x07${url}\x1b]8;;\x07`;
}

async function bootstrap() {
  // Fail before creating the app if the version is missing
  const version = getAppVersion();

  const logger = new Logger("bootstrap");

  const app = await NestFactory.create(AppModule);

  const swaggerPath = "swagger";

  SwaggerModule.setup(swaggerPath, app, () =>
    createOpenApiDocument(app, version),
  );

  configureApp(app);
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 5201);

  const url = await app.getUrl();
  const swaggerUrl = `${url}/${swaggerPath}`;

  logger.log(`Version ${version}`);
  logger.log(`Listening on ${hyperlink(url)}`);
  logger.log(`Swagger available on ${hyperlink(swaggerUrl)}`);
}
await bootstrap();
