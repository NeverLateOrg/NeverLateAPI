import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<UserDocument>) {}

  async getUserFromId(id: string): Promise<User | null> {
    return await this.UserModel.findById(id);
  }

  async getUserFromMail(mail: string): Promise<User | null> {
    return await this.UserModel.findOne({ email: mail });
  }
}
