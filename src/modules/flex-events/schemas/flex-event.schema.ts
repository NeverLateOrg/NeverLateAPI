/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Event } from 'src/modules/events/schemas/event.schema';
import { UserCustomLocation } from 'src/modules/locations/user/custom/schemas/user.location.custom.schema';
import { UserPlaceLocation } from 'src/modules/locations/user/place/schemas/user.location.place.schema';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export type FlexEventDocument = FlexEvent & Document;

class FlexEventMethods {}

@Schema()
export class FlexEvent extends FlexEventMethods {
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Event.name, required: false, default: null })
  event: Event;

  @Prop({ type: Date, required: true })
  min_date: Date;

  @Prop({ type: Date, required: true })
  max_date: Date;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: String, enum: ['UserCustomLocation', 'UserPlaceLocation'] })
  savedLocationType?: 'UserCustomLocation' | 'UserPlaceLocation';

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'savedLocationType' })
  savedLocation?: UserCustomLocation | UserPlaceLocation;

  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] })
  constraints: object[];
}

export const FlexEventSchema = SchemaFactoryCustom.createForClass(FlexEvent, FlexEventMethods);
