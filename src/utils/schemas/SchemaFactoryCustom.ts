/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export default class SchemaFactoryCustom {
  static createForClass<T>(target: Type<T>): Schema<T> {
    const schema = SchemaFactory.createForClass(target);
    console.log(target.prototype);
    for (const method of Object.getOwnPropertyNames(target.prototype)) {
      if (method === 'constructor') {
        continue;
      }
      schema.methods[method] = target.prototype[method];
    }
    return schema;
  }
}
