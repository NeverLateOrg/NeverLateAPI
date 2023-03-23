import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDTO, ResponseEventDTO, DeleteEventDTO } from './dto';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly EventModel: Model<EventDocument>) {}

  public async createEvent(createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    return await this.EventModel.create(createEventDTO);
  }

  public async findAllEvents(): Promise<ResponseEventDTO[]> {
    return await this.EventModel.find().exec();
  }

  public async deleteEvent(deleteEventDTO: DeleteEventDTO): Promise<boolean> {
    await this.EventModel.deleteOne(deleteEventDTO).catch(function (error) {
      console.log(error);
      return false;
    });
    return true;
  }
}
