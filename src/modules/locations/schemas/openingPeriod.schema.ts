import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OpeningPeriod {
  constructor(data: Partial<Location>) {
    Object.assign(this, data);
  }

  @Prop({ required: true })
  open: {
    day: number;
    time: string;
  };

  @Prop({ required: true })
  close: {
    day: number;
    time: string;
  };
}

export const OpeningPeriodSchema = SchemaFactory.createForClass(OpeningPeriod);
