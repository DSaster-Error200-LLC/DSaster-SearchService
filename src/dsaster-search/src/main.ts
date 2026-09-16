import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module.js";

function hyperlink(url: string): string {
  return `\x1b]8;;${url}\x07${url}\x1b]8;;\x07`;
}

async function bootstrap() {
  const logger = new Logger("bootstrap");

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("DSaster-Search")
    .setVersion("0.0.1")
    .build();
  SwaggerModule.setup("swagger", app, () =>
    SwaggerModule.createDocument(app, config),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  const url = await app.getUrl();
  const swaggerUrl = `${url}/swagger`;

  logger.log(`Listening on ${hyperlink(url)}`);
  logger.log(`Swagger available on ${hyperlink(swaggerUrl)}`);
}
await bootstrap();
