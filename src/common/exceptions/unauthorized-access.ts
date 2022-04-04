import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants';

export class UnauthorizedAccessError extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
  }
}
