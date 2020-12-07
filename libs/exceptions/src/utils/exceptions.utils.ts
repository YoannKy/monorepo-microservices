import { Catch, RpcExceptionFilter, HttpStatus } from '@nestjs/common';

import { Observable, throwError } from 'rxjs';

export interface MicroServiceError {
  status: number;
  message: string | unknown;
}

export class BadParamValidatorError extends Error {
  constructor(message = '{ error: Invalid parameters }') {
    super(message);
    this.name = 'BadParamValidatorError';
  }
}

export class AjvUknownError extends Error {
  constructor(message = 'Unknown error from ajv') {
    super(message);
    this.name = 'AjvUknownError';
  }
}

export class DatabaseError extends Error {
  constructor(message = 'Database threw an error') {
    super(message);
    this.name = 'DatabaseError';
  }
}

@Catch(BadParamValidatorError)
export class BadParameterExceptionFilter
  implements RpcExceptionFilter<BadParamValidatorError> {
  catch(error: BadParamValidatorError): Observable<MicroServiceError> {
    return throwError({
      status: HttpStatus.BAD_REQUEST,
      message: JSON.parse(error.message),
    });
  }
}

@Catch(AjvUknownError, DatabaseError)
export class UnknownExceptionFilter
  implements RpcExceptionFilter<AjvUknownError> {
  catch(): Observable<MicroServiceError> {
    return throwError({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'A server error occured',
    });
  }
}
