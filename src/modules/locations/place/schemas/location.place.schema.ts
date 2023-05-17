/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';
import { WeekOpeningPeriod, WeekOpeningPeriodSchema } from '../../schemas/weekOpeningPeriod.schema';

export type PlaceLocationDocument = PlaceLocation & mongoose.Document;

class PlaceLocationMethods {}

@Schema()
export class PlaceLocation extends PlaceLocationMethods {
  _id: string;

  @Prop({ required: true, unique: true })
  placeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: false })
  imageRef?: string;

  @Prop({ type: WeekOpeningPeriodSchema })
  opening_hours?: WeekOpeningPeriod;
}

export const PlaceLocationSchema = SchemaFactoryCustom.createForClass(PlaceLocation, PlaceLocationMethods);
