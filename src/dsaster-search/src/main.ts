import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

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

  await app.listen(process.env.PORT ?? 3000);

  const url = await app.getUrl();
  logger.log(`Listening on ${url}`);
  logger.log(`Swagger available on ${url}/swagger`);
}
await bootstrap();
