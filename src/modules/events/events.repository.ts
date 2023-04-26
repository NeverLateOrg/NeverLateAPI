import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { GoogleService } from '../google/google.service';
import { User } from '../users/schemas/user.schema';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsRepository extends EntityRepository<EventDocument> {
  constructor(
    @InjectModel(Event.name) private readonly EventModel: Model<EventDocument>,
    private readonly googleService: GoogleService,
  ) {
    super(EventModel);
  }

  public async createEvent(user: User, createEventData: any): Promise<Event> {
    const event = await this.create({ ...createEventData, user: user._id });
    if (event.location !== undefined) {
      event.location = await this.googleService.formatLocation(event.location);
    }
    return await this.save(event);
  }

  public async findNextEvents(event: Event): Promise<Event[]> {
    const nextEvents = await this.EventModel.find({
      start_date: { $gte: event.end_date },
      _id: { $ne: event._id }, // exclude the given event from the results
    })
      .sort({ start_date: 1 }) // sort by start date in ascending order
      .limit(1) // limit to the first result
      .exec();
    return nextEvents;
  }

  public async findPreviousEvents(event: Event): Promise<Event[]> {
    const previousEvents = await this.EventModel.find({
      end_date: { $lte: event.start_date },
      _id: { $ne: event._id }, // exclude the given event from the results
    })
      .sort({ end_date: -1 }) // sort by start date in ascending order
      .limit(1) // limit to the first result
      .exec();
    return previousEvents;
  }

  public async updateEvent(user: User, eventId: string, updateEventData: any): Promise<Event> {
    const filter = { _id: eventId, user: user._id };
    const updatedEvent = await this.findOneAndUpdate(filter, updateEventData);
    if (updatedEvent == null) {
      throw new NotFoundException('Event not found, or not owned by the user');
    }
    if (updateEventData.location !== undefined && updatedEvent.location !== undefined) {
      updatedEvent.location = await this.googleService.formatLocation(updatedEvent.location);
    }
    return await this.save(updatedEvent);
  }

  public async getUserEvents(user: User): Promise<Event[]> {
    const events = await this.find({ user: user._id });
    return events;
  }

  public async getUserEvent(user: User, eventId: string): Promise<EventDocument | null> {
    return await this.findOne({ user: user._id, _id: eventId });
  }
}
