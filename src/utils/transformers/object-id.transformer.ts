// objectId.transformer.ts
import { Transform } from 'class-transformer';

export function TransformObjectId(): any {
  return Transform(({ obj }) => obj._id.toString());
}
