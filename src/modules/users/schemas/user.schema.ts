import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Event } from '../../events/schemas/event.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Event }], required: true })
  events: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
