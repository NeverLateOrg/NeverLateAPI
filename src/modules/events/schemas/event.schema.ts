/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export type EventDocument = Event & Document;

export enum EventStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

class EventMethods {}

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

  @Prop({ type: String, enum: Object.values(EventStatus), default: EventStatus.PENDING })
  status: EventStatus;
}

export const EventSchema = SchemaFactoryCustom.createForClass(Event);
