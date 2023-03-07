import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDTO, ResponseEventDTO } from './dto';
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
}
