/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Event } from 'src/modules/events/schemas/event.schema';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export type TravelsDocument = HydratedDocument<Travels>;

class TravelMethods {}

@Schema()
export class Travel extends TravelMethods {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Event.name })
  fromEvent: Event;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Date, required: true })
  departureDate: Date;
}

const TravelSchema = SchemaFactoryCustom.createForClass(Travel);

class TravelsMethods {}

@Schema()
export class Travels extends TravelsMethods {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Event.name, unique: true })
  destinationEvent: Event;

  @Prop({ type: [TravelSchema] })
  travels: Travel[];
}

export const TravelsSchema = SchemaFactoryCustom.createForClass(Travels);
