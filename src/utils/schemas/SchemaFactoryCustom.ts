/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export default class SchemaFactoryCustom {
  static createForClass<T extends TT, TT>(target: Type<T>, targetMethods: Type<TT>): Schema<T> {
    const schema = SchemaFactory.createForClass(target);
    for (const method of Object.getOwnPropertyNames(target.prototype)) {
      schema.methods[method] = target.prototype[method];
    }
    return schema;
  }
}
