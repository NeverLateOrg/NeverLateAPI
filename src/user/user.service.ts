import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { type User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async addUser(name: string, email: string): Promise<string> {
    const user = new this.UserModel({ name, email });
    await user.save();
    return 'new user created';
  }
}
