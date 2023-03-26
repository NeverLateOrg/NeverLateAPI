import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(firstname: string, lastname: string, email: string, password: string): Promise<string> {
    let found = await this.getUser(email);
    found = String(found);
    if (!found.includes('not found')) {
      return 'user already present in db';
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new this.UserModel({ firstname, lastname, email, password: hashedPassword });
    await user.save();
    return 'new user created';
  }

  async getUser(email: string): Promise<string> {
    const user = await this.UserModel.findOne({ email }).exec();
    if (user != null) return user.email;
    return 'user `' + email + '` not found';
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.UserModel.findOne({ email }).exec();
    if (user == null) return null;

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (isPasswordMatching === false) return null;

    return user;
  }
}
