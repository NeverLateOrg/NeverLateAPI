import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { WeekOpeningPeriod, WeekOpeningPeriodSchema } from '../../schemas/weekOpeningPeriod.schema';

export type PlaceLocationDocument = PlaceLocation & mongoose.Document;

@Schema()
export class PlaceLocation {
  _id: string;

  constructor(data: Partial<PlaceLocation>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, unique: true })
  placeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  imageRef?: string;

  @Prop({ type: WeekOpeningPeriodSchema })
  opening_hours?: WeekOpeningPeriod;
}

export const PlaceLocationSchema = SchemaFactory.createForClass(PlaceLocation);
