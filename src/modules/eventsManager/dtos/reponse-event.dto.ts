import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TransformObjectId } from 'src/utils/transformers';

export class ResponseEventDTO {
  @Expose()
  @ApiProperty()
  @TransformObjectId()
  public _id: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public start_date: Date;

  @Expose()
  @ApiProperty()
  public end_date: Date;

  @Expose()
  @ApiProperty({ required: false })
  public location?: string;
}
