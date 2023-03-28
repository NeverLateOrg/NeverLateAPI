import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDTO, UpdateEventDTO } from '../eventsManager/dto';
import { User } from '../users/schemas/user.schema';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly EventModel: Model<EventDocument>) {}

  public async createEvent(user: User, createEventDTO: CreateEventDTO): Promise<Event> {
    const event = new this.EventModel({ ...createEventDTO, user: user.id });
    return await event.save();
  }

  public async getUserEvents(user: User): Promise<Event[]> {
    const events = await this.EventModel.find({ user });
    return events;
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

  public async deleteEvent(eventId: string): Promise<boolean> {
    await this.EventModel.findByIdAndDelete(eventId).catch(function (error) {
      console.log(error);
      return false;
    });
    return true;
  }

  public async updateEvent(updateEventDTO: UpdateEventDTO): Promise<Event> {
    const filter = { _id: updateEventDTO._id };
    const returnUpdated = { new: true };
    // findOneAndUpdate returns the updated document thanks to returnUpdated
    const updatedEvent = await this.EventModel.findOneAndUpdate(filter, updateEventDTO, returnUpdated);
    if (updatedEvent == null) {
      throw new NotFoundException(`document with _id ${updateEventDTO._id} not found`);
    }
    return updatedEvent;
  }

  public async getEvent(eventId: string): Promise<Event | null> {
    return await this.EventModel.findById(eventId);
  }
}
