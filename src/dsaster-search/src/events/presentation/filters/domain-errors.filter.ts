import {
  ArgumentsHost,
  Catch,
  ConflictException,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { EventAlreadyExistsError } from "@app/events/domain/errors/event-already-exists.error.js";
import { EventNotFoundError } from "@app/events/domain/errors/event-not-found.error.js";

type DomainError = EventAlreadyExistsError | EventNotFoundError;

export function toHttpException(error: DomainError): HttpException {
  if (error instanceof EventNotFoundError) {
    return new NotFoundException(error.message);
  }

  return new ConflictException(error.message);
}

@Catch(EventAlreadyExistsError, EventNotFoundError)
export class DomainErrorsFilter extends BaseExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost): void {
    super.catch(toHttpException(error), host);
  }
}
