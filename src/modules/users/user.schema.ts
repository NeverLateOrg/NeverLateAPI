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
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
