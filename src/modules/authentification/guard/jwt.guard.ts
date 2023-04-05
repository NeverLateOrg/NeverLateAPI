import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line
  constructor() {
    super();
  }
}
