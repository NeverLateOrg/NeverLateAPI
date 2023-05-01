import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { GoogleService } from '../google/google.service';
import { User } from '../users/schemas/user.schema';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';

@Injectable()
export class EventsRepository extends EntityRepository<EventDocument> {
  constructor(
    @InjectModel(Event.name) private readonly EventModel: Model<EventDocument>,
    private readonly googleService: GoogleService,
  ) {
    super(EventModel);
  }

  public async createLocalEvent(user: User, createEventData: any): Promise<Event> {
    // by default a local event created by the user is set to accepted
    const event = await this.create({ ...createEventData, status: EventStatus.ACCEPTED, user: user._id });
    if (event.location !== undefined) {
      event.location = await this.googleService.formatLocation(event.location);
    }
    return await this.save(event);
  }

  public async getNextEventsOfEvent(event: Event): Promise<Event[]> {
    const nextEvent = await this.EventModel.find({
      user: event.user,
      start_date: { $gt: event.end_date },
      _id: { $ne: event._id }, // does not include the event in parameter.
    })
      .sort({ start_date: 1 })
      .limit(1);

    return await this.getSimultaneousEventsOfEvent(nextEvent[0]);
  }

  public async getPreviousEventsOfEvent(event: Event): Promise<Event[]> {
    const prevEvent = await this.EventModel.find({
      user: event.user,
      end_date: { $lt: event.start_date },
      _id: { $ne: event._id }, // does not include the event in parameter.
    })
      .sort({ end_date: -1 })
      .limit(1);
    return await this.getSimultaneousEventsOfEvent(prevEvent[0]);
  }

  public async getSimultaneousEventsOfEvent(event: Event): Promise<Event[]> {
    return await this.EventModel.find({
      user: event.user,
      $or: [
        { start_date: { $lt: event.end_date }, end_date: { $gt: event.start_date } },
        { start_date: { $gte: event.start_date }, end_date: { $lte: event.end_date } },
      ],
    });
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

  // This function can set the status of an event to "accepted" or "rejected"
  public async setEventStatus(user: User, eventId: string, status: EventStatus): Promise<Event> {
    const event = await this.findOne({ user: user._id, _id: eventId });
    if (event == null) {
      throw new NotFoundException('Event not found, or not owned by the user');
    }
    event.status = status;
    return await this.save(event);
  }

  public async getEventById(user: User, eventId: string): Promise<Event> {
    const event = await this.findOne({ user: user._id, _id: eventId });
    if (event == null) {
      throw new NotFoundException('Event not found, or not owned by the user');
    }
    return event;
  }
}
