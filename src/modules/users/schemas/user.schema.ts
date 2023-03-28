import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  id: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
