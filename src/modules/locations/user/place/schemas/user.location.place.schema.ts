/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PlaceLocation } from 'src/modules/locations/place/schemas/location.place.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export type UserPlaceLocationDocument = UserPlaceLocation & mongoose.Document;

class UserPlaceLocationMethods {}

@Schema()
export class UserPlaceLocation extends UserPlaceLocationMethods {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: PlaceLocation.name })
  placeLocation: PlaceLocation;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const UserPlaceLocationSchema = SchemaFactoryCustom.createForClass(UserPlaceLocation);
