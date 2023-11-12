import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as dotenv from 'dotenv';
import { UsersRepository } from 'src/modules/users/users.repository';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: { sub: number; email: string }): Promise<any> {
    const userDoc = await this.userRepository.findOne({ email: payload.email });
    await userDoc?.populate('trustedUsers');
    return userDoc;
  }
}
