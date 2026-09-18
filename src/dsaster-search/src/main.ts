import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module.js";
import { createOpenApiDocument } from "./openapi.js";
import { configureApp } from "./configuration.js";

function hyperlink(url: string): string {
  return `\x1b]8;;${url}\x07${url}\x1b]8;;\x07`;
}

async function bootstrap() {
  const logger = new Logger("bootstrap");

  const app = await NestFactory.create(AppModule);

  const swaggerPath = "swagger";

  SwaggerModule.setup(swaggerPath, app, () => createOpenApiDocument(app));

  configureApp(app);

  await app.listen(process.env.PORT ?? 3000);

  const url = await app.getUrl();
  const swaggerUrl = `${url}/${swaggerPath}`;

  logger.log(`Listening on ${hyperlink(url)}`);
  logger.log(`Swagger available on ${hyperlink(swaggerUrl)}`);
}
await bootstrap();
