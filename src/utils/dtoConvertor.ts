import { ClassConstructor, plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';

export default function toDTO<T>(cls: ClassConstructor<T>, plain: object): T {
  if (plain instanceof mongoose.Document) {
    plain = plain.toObject();
  }
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}
