import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export type UserDocument = User & mongoose.Document;

class UserMethods {
  is(this: User, user: User): boolean {
    return this._id === user._id;
  }
}

@Schema()
export class User extends UserMethods {
  _id: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  passwordHash: string;
}

export const UserSchema = SchemaFactoryCustom.createForClass(User);
