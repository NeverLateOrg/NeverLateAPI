import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EventDTO } from './event.dto';

export class CreateEventDTO extends EventDTO {
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
