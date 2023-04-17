import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDTO, UpdateEventDTO } from '../eventsManager/dtos';
import { User } from '../users/user.schema';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly EventModel: Model<EventDocument>) {}

  public async createEvent(user: User, createEventDTO: CreateEventDTO): Promise<Event> {
    const event = new this.EventModel({ ...createEventDTO, user: user._id });
    return await event.save();
  }

  public async findNextEvents(event: Event): Promise<Event[]> {
    const nextEvents = await this.EventModel.find({
      start_date: { $gte: event.end_date },
      _id: { $ne: event.id }, // exclude the given event from the results
    })
      .sort({ start_date: 1 }) // sort by start date in ascending order
      .limit(1) // limit to the first result
      .exec();
    return nextEvents;
  }

  public async findPreviousEvents(event: Event): Promise<Event[]> {
    const previousEvents = await this.EventModel.find({
      end_date: { $lte: event.start_date },
      _id: { $ne: event.id }, // exclude the given event from the results
    })
      .sort({ end_date: -1 }) // sort by start date in ascending order
      .limit(1) // limit to the first result
      .exec();
    return previousEvents;
  }

  public async updateEvent(user: User, eventId: string, updateEventDTO: UpdateEventDTO): Promise<Event> {
    const filter = { _id: eventId, user: user._id };
    const returnUpdated = { new: true };
    const updatedEvent = await this.EventModel.findOneAndUpdate(filter, updateEventDTO, returnUpdated);
    if (updatedEvent == null) {
      throw new NotFoundException('Event not found, or not owned by the user');
    }
    return updatedEvent;
  }

  public async getUserEvents(user: User): Promise<Event[]> {
    const events = await this.EventModel.find({ user: user._id });
    return events;
  }

  public async getUserEvent(user: User, eventId: string): Promise<EventDocument | null> {
    return await this.EventModel.findOne({ user: user._id, _id: eventId });
  }
}
