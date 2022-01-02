// Based on a motivation and solution form:
// https://docs.nestjs.com/exception-filters#throwing-standard-exceptions
// https://stackoverflow.com/questions/58993405/how-can-i-handle-typeorm-error-in-nestjs
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
  UpdateValuesMissingError,
} from 'typeorm';
import { HttpAdapterHost } from '@nestjs/core';
import { ForbiddenError } from '@casl/ability';

/**
 * Catch unhandled exceptions and return proper Http response code
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    let message = (exception as any).message.message;

    Logger.error(
      message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );
    let httpStatus;
    let responseBody;
    switch (exception.constructor) {
      case ForbiddenError:
        httpStatus = HttpStatus.FORBIDDEN;
        message = (exception as HttpException).message;
        break;
      case QueryFailedError: // TypeOrm error
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        break;
      case EntityNotFoundError: // TypeOrm error
        httpStatus = HttpStatus.NOT_FOUND;
        message = (exception as EntityNotFoundError).message;
        break;
      case CannotCreateEntityIdMapError: // TypeOrm error
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        break;
      case UpdateValuesMissingError: // Typeorm error
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as UpdateValuesMissingError).message;
        break;
      default:
        const httpException = exception as HttpException;
        if (httpException.getResponse) {
          responseBody = (exception as HttpException).getResponse();
          httpStatus = httpException.getStatus();
        } else {
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        if (!message) {
          message = 'Internal Server Error';
        }
    }

    if (!responseBody) {
      responseBody = {
        statusCode: httpStatus,
        message,
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
