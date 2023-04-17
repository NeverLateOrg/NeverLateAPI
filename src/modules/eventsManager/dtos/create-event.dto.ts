import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public start_date: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public end_date: Date;

  @IsString()
  @ApiProperty({ required: false })
  public location?: string;
}
