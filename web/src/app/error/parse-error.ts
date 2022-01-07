import { HttpErrorResponse } from '@angular/common/http';

export interface Error {
  message: string;
  code: number;
}
/**
 * Takes an error object as input and extracts ErrorMessage out of it
 * @param error
 */
export function parseError(err) {
  if (err instanceof HttpErrorResponse) {
    return parseHttpError(err);
  }
  return <Error>{
    message: 'An error occurred. Please try again.',
  };
}

function parseHttpError(err: HttpErrorResponse) {
  const error: Error = <Error>{};
  if (err.error) {
    if (err.error.message) {
      error.message = err.error.message;
    }
    if (err.error.error) {
      error.message = err.error.error;
    }
  }
  error.code = err.status;
  return error;
}
