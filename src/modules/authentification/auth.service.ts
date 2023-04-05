import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../users/user.schema';
import * as argon from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>, private readonly jwt: JwtService) {}

  async register(registerDTO: RegisterDTO): Promise<string> {
    const hashedPassword = argon.hash(registerDTO.password);
    // eslint-disable-next-line no-useless-catch
    try {
      const user = new this.UserModel({
        email: registerDTO.email,
        firstname: registerDTO.firstname,
        lastname: registerDTO.lastname,
        passwordHash: hashedPassword,
      });
      await user.save();

      return await this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  async login(loginDTO: LoginDTO): Promise<string> {
    const user = await this.UserModel.findOne({ email: loginDTO.email }).exec();
    if (user == null) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.passwordHash, loginDTO.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return await this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secretJwt = process.env.JTW_SECRET;
    return await this.jwt.signAsync(payload, { expiresIn: '365d', secret: secretJwt });
  }
}
