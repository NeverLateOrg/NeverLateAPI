import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  _id: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  is(user: User): boolean {
    return this._id === user._id;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
