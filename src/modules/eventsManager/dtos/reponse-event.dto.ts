import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EventDTO } from './event.dto';

export class ResponseEventDTO extends EventDTO {
  @Expose()
  @ApiProperty()
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
