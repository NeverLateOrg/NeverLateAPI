import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async addUser(name: string, email: string): Promise<string> {
    const user = new this.UserModel({ name, email });
    await user.save();
    return 'new user created';
  }

  public async addEventToUser(userId: string, eventId: string): Promise<boolean> {
    // TODO: add eventId to the user's events
    return true;
  }
}
