import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>, private readonly jwt: JwtService) {}

  async register(registerDTO: RegisterDTO): Promise<string> {
    const email = registerDTO.email;
    const toto = await this.userModel.findOne({ email }).exec();

    if (toto != null) throw new ForbiddenException('Email already used.');

    const hashedPassword = await argon.hash(registerDTO.password);
    // eslint-disable-next-line no-useless-catch
    try {
      // eslint-disable-next-line new-cap
      const newUser = new this.userModel({
        email: registerDTO.email.toLowerCase(),
        firstName: registerDTO.firstName,
        lastName: registerDTO.lastName,
        passwordHash: hashedPassword,
      });
      await newUser.save();

      return await this.signToken(newUser.id, newUser.email);
    } catch (error) {
      throw error;
    }
  }

  async login(loginDTO: LoginDTO): Promise<string> {
    const user = await this.userModel.findOne({ email: loginDTO.email }).exec();
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

    const secretJwt = process.env.JWT_SECRET;
    return await this.jwt.signAsync(payload, { expiresIn: '365d', secret: secretJwt });
  }
}
