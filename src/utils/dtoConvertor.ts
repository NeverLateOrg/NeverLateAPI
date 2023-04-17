import { ClassConstructor, plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';

export default function toDTO<T>(cls: ClassConstructor<T>, ...plains: object[]): T {
  const formattedPlains: object[] = [];
  for (const plain of plains) {
    if (plain instanceof mongoose.Document) {
      formattedPlains.push(plain.toObject());
    } else {
      formattedPlains.push(plain);
    }
  }
  const plain = Object.assign({}, ...formattedPlains);
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}
