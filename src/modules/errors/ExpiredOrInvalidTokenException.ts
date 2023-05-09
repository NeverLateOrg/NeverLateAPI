import { UnauthorizedException } from '@nestjs/common';

export default class ExpiredOrInvalidTokenException extends UnauthorizedException {
  constructor() {
    super({
      error: {
        type: 'ExpiredOrInvalidToken',
      },
    });
  }
}
