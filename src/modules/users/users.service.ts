import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseEventDTO } from '../eventsManager/dto';
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

  public async getEvents(userId: string): Promise<ResponseEventDTO[]> {
    // TODO:
    const events: ResponseEventDTO[] = [];
    return events;
  }

  public async deleteEvent(userId: string, eventId: string): Promise<boolean> {
    // TODO:
    // this.UserModel.updateOne({ _id: userId }, { $pullAll: {} });
    return true;
  }
}
