/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import ExpiredOrInvalidTokenException from 'src/modules/errors/ExpiredOrInvalidTokenException';

export class JwtGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    console.log(info);
    if (err || !user) {
      throw new ExpiredOrInvalidTokenException();
    }
    return user;
  }
}
