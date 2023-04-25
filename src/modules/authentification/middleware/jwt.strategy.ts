import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { InjectModel } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { Model } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: { sub: number; email: string }): Promise<any> {
    return await this.userModel.findOne({ email: payload.email }).exec();
  }
}
