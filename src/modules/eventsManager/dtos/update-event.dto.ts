import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EventDTO } from './event.dto';

export class UpdateEventDTO extends EventDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  public name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  public start_date: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  public end_date: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  public location?: string;
}