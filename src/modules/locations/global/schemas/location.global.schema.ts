import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OpeningPeriod, OpeningPeriodSchema } from '../../schemas/openingPeriod.schema';

export type LocationDocument = Location & mongoose.Document;

@Schema()
export class Location {
  _id: string;

  constructor(data: Partial<Location>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, unique: true })
  placeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [OpeningPeriodSchema] })
  periods?: OpeningPeriod[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
