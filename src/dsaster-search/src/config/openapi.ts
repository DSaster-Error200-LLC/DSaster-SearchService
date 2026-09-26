import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("DSaster-Search")
    .setVersion("0.0.1")
    .build();

  return SwaggerModule.createDocument(app, config);
}
