import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function createOpenApiDocument(app: INestApplication, version: string) {
  const config = new DocumentBuilder()
    .setTitle("DSaster-Search")
    .setVersion(version)
    .build();

  return SwaggerModule.createDocument(app, config);
}
