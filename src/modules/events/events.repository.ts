import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { LocationValidatorService } from '../travels/locationFormator/formator.service';
import { User } from '../users/schemas/user.schema';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsRepository extends EntityRepository<EventDocument> {
  constructor(
    @InjectModel(Event.name) private readonly EventModel: Model<EventDocument>,
    private readonly locationValidatorService: LocationValidatorService,
  ) {
    super(EventModel);
  }

  public async createEvent(user: User, createEventData: object): Promise<Event> {
    let event = await this.create({ ...createEventData, user: user._id });
    event = await this.locationValidatorService.format(event);
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

  public async updateEvent(user: User, eventId: string, updateEventData: object): Promise<Event> {
    const filter = { _id: eventId, user: user._id };
    let updatedEvent = await this.findOneAndUpdate(filter, updateEventData);
    if (updatedEvent == null) {
      throw new NotFoundException('Event not found, or not owned by the user');
    }
    updatedEvent = await this.locationValidatorService.format(updatedEvent);
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
