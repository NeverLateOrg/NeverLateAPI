import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PlaceLocation } from 'src/modules/locations/place/schemas/location.place.schema';
import { WeekOpeningPeriod, WeekOpeningPeriodSchema } from 'src/modules/locations/schemas/weekOpeningPeriod.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type UserPlaceLocationDocument = UserPlaceLocation & mongoose.Document;

@Schema()
export class UserPlaceLocation {
  _id: string;

  constructor(data: Partial<UserPlaceLocation>) {
    Object.assign(this, data);
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: PlaceLocation.name })
  placeLocation: PlaceLocation;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: WeekOpeningPeriodSchema })
  custom_opening_hours?: WeekOpeningPeriod;
}

export const UserPlaceLocationSchema = SchemaFactory.createForClass(UserPlaceLocation);