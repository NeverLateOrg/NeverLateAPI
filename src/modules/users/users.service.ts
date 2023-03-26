import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { Model } from 'mongoose';
import { ResponseEventDTO } from '../eventsManager/dto';
import { UserEventsSchema } from './schemas/user-events.schema';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<UserDocument>) {}

  async addUser(name: string, email: string): Promise<string> {
    const user = new this.UserModel({ name, email });
    await user.save();
    return 'new user created';
  }

  public async addEventToUser(userId: string, eventId: string): Promise<boolean> {
    const filter = { _id: userId };
    const update = { $addToSet: { events: eventId } };
    await this.UserModel.updateOne(filter, update)
      .exec()
      .catch(function (error) {
        console.log(error);
        return false;
      });
    return true;
  }

  public async getEvents(userId: string): Promise<ResponseEventDTO[]> {
    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'events',
          foreignField: '_id',
          as: 'events',
        },
      },
    ];
    const plain = await this.UserModel.aggregate(pipeline).exec();
    if (plain.length === 0) {
      return [];
    }
    // plainToInstance will fail if the array is empty
    const userEvents = plainToInstance(UserEventsSchema, plain[0]);
    return userEvents.events;
  }

  public async deleteEvent(userId: string, eventId: string): Promise<boolean> {
    // TODO:
    // this.UserModel.updateOne({ _id: userId }, { $pullAll: {} });
    return true;
  }

  public async findNextEvent(userId: string, eventId: string): Promise<ResponseEventDTO> {
    // const aggregate = Model.aggregate([
    //   {
    //     $match: {_id: userId}
    //   }, {
    //     $lookup: {
    //       from: 'events',
    //       localField: 'events',
    //       foreignField: '_id',
    //       as: 'events'
    //     }
    //   }, {
    //     $sort: {}
    //   }

    // ])
    // this.UserModel.aggregate(pipeline))
    return new ResponseEventDTO();
  }
}
