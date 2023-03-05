import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateEventDTO, ResponseEventDTO } from './dto';
import { Event } from './events.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly EventModel: Model<Event>) {}

  public async addEvent(createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    const event = new this.EventModel(createEventDTO);
    const newEvent = await event.save();
    return plainToInstance(ResponseEventDTO, newEvent.toJSON());
  }
}
