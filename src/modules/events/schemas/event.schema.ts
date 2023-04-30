import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type EventDocument = Event & Document;

export enum EventStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Schema()
export class Event {
  constructor(data: Partial<Event>) {
    Object.assign(this, data);
  }

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

  @Prop({ type: String, enum: Object.values(EventStatus), default: EventStatus.PENDING })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
