import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document } from 'mongoose';

@Schema()
export class Event {
  public id: string;

  @Prop({ type: String, required: true })
  public name: string;

  @Prop({ type: String, required: true })
  public namasde: string;

  @Prop({ type: Date, required: true })
  public start_date: Date;

  @Prop({ type: Date, required: true })
  public end_date: Date;
}

export type EventDocument = Event & Document;

export const EventSchema = SchemaFactory.createForClass(Event);
