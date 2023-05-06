/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// objectId.transformer.ts
import { Transform } from 'class-transformer';

export function TransformObjectId(keys = ['_id']): any {
  return Transform(({ obj }) => {
    let cur = obj;
    let i = 0;
    while (i < keys.length) {
      cur = cur[keys[i]];
      i++;
    }
    return cur.toString();
  });
}
