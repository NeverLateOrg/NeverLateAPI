import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async addUser(name: string, email: string, password: string): Promise<string> {
    const user = new this.UserModel({ name, email, password });
    await user.save();
    return 'new user created';
  }

  async getUser(email: string): Promise<string> {
    const user = await this.UserModel.findOne({ email }).exec();
    if (user != null) return user.email;
    return 'user `' + email + '` not found';
  }
}
