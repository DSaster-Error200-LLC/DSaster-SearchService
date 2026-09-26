import { INestApplication, ValidationPipe } from "@nestjs/common";

export function configureApp(app: INestApplication) {
  app.useGlobalPipes(createValidationPipe());
}

function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transform: true,
  });
}
