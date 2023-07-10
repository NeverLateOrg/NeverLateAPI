/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserCustomLocation } from 'src/modules/locations/user/custom/schemas/user.location.custom.schema';
import { UserPlaceLocation } from 'src/modules/locations/user/place/schemas/user.location.place.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';
import { CreateEventDTO } from '../dtos';

export type EventDocument = Event & Document;

export enum EventStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

class EventMethods {
  overlaps(this: Event, event: CreateEventDTO): boolean {
    return this.start_date < event.end_date && event.start_date < this.end_date;
  }

  hasLocation(this: Event): boolean {
    return this.location !== undefined || this.savedLocation !== undefined;
  }

  getLocation(this: Event): string | UserCustomLocation | UserPlaceLocation {
    if (this.location !== undefined) {
      return this.location;
    }
    if (this.savedLocation !== undefined) {
      return this.savedLocation;
    }
    throw new Error('Event has no location');
  }

  getLocationString(this: Event): string {
    const location = this.getLocation();
    if (typeof location === 'string') {
      return location;
    }
    if (this.savedLocationType === 'UserCustomLocation') {
      return (location as UserCustomLocation).location;
    }
    return (location as UserPlaceLocation).placeLocation.location;
  }
}

@Schema()
export class Event extends EventMethods {
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: String, enum: ['UserCustomLocation', 'UserPlaceLocation'] })
  savedLocationType?: 'UserCustomLocation' | 'UserPlaceLocation';

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'savedLocationType' })
  savedLocation?: UserCustomLocation | UserPlaceLocation;

  @Prop({ type: String, enum: Object.values(EventStatus), default: EventStatus.PENDING })
  status: EventStatus;
}

export const EventSchema = SchemaFactoryCustom.createForClass(Event, EventMethods);
