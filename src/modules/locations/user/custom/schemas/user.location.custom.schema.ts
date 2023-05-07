import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { WeekOpeningPeriod, WeekOpeningPeriodSchema } from 'src/modules/locations/schemas/weekOpeningPeriod.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type UserCustomLocationDocument = UserCustomLocation & mongoose.Document;

@Schema()
export class UserCustomLocation {
  _id: string;

  constructor(data: Partial<UserCustomLocation>) {
    Object.assign(this, data);
  }

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: WeekOpeningPeriodSchema })
  openingHours?: WeekOpeningPeriod;
}

export const UserCustomLocationSchema = SchemaFactory.createForClass(UserCustomLocation);