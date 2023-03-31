/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Event } from 'src/modules/events/event.schema';

export type TravelsDocument = HydratedDocument<Travels>;

@Schema()
export class Travel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Event.name })
  fromEvent: Event;

  @Prop({ type: Number, required: true })
  duration: number;
}

const TravelSchema = SchemaFactory.createForClass(Travel);

@Schema()
export class Travels {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Event.name, unique: true })
  destinationEvent: Event;

  @Prop({ type: [TravelSchema] })
  travels: Travel[];
}

export const TravelsSchema = SchemaFactory.createForClass(Travels);
