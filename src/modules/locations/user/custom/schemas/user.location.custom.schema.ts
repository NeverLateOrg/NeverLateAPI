/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { WeekOpeningPeriod, WeekOpeningPeriodSchema } from 'src/modules/locations/schemas/weekOpeningPeriod.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export type UserCustomLocationDocument = UserCustomLocation & mongoose.Document;

class UserCustomLocationMethods {}

@Schema()
export class UserCustomLocation extends UserCustomLocationMethods {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: WeekOpeningPeriodSchema })
  openingHours?: WeekOpeningPeriod;
}

export const UserCustomLocationSchema = SchemaFactoryCustom.createForClass(
  UserCustomLocation,
  UserCustomLocationMethods,
);
