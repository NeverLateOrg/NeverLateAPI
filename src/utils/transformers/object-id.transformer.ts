// objectId.transformer.ts
import { Transform } from 'class-transformer';

export function TransformObjectId(propName = '_id'): any {
  return Transform(({ obj }) => {
    return obj[propName].toString();
  });
}
