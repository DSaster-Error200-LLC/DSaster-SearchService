import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { RegisterEventUseCase } from "./events/application/use-cases/register-event.use-case.js";

import { AppModule } from "./app.module.js";
import { getAppVersion } from "./config/app-version.js";
import { createOpenApiDocument } from "./config/openapi.js";
import { configureApp } from "./config/configuration.js";
import { seedExampleEvents } from "./config/seed-example-events.js";

function hyperlink(url: string): string {
  return `\x1b]8;;${url}\x07${url}\x1b]8;;\x07`;
}

async function bootstrap() {
  const version = getAppVersion();

  const logger = new Logger("bootstrap");

  const app = await NestFactory.create(AppModule);

  const swaggerPath = "swagger";

  SwaggerModule.setup(swaggerPath, app, () =>
    createOpenApiDocument(app, version),
  );

  configureApp(app);
  app.enableShutdownHooks();

  // The lifecycle hooks, such as creating the Elasticsearch index, run before
  // the example events are registered
  await app.init();
  await seedExampleEvents(app.get(RegisterEventUseCase));

  await app.listen(process.env.PORT ?? 5201);

  const url = await app.getUrl();
  const swaggerUrl = `${url}/${swaggerPath}`;

  logger.log(`Version ${version}`);
  logger.log(`Listening on ${hyperlink(url)}`);
  logger.log(`Swagger available on ${hyperlink(swaggerUrl)}`);
}
await bootstrap();
