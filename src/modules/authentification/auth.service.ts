import { Injectable } from '@nestjs/common';
import { TokenDTO } from './dtos/token.dto';
import { User } from '../users/user.schema';
import * as argon from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({})
export class AuthService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async register(RegisterDTO): Promise<TokenDTO> {
    const hashedPassword = argon.hash(RegisterDTO.password);

    const user = new this.UserModel({
      email: RegisterDTO.email,
      firstname: RegisterDTO.firstname,
      lastname: RegisterDTO.lastname,
      passwordHash: hashedPassword,
    });

    // save user in db.
    await user.save();
    // return jwt token
    return new TokenDTO();
  }

  async login(LoginDTO): Promise<TokenDTO> {
    return new TokenDTO();
  }
}
