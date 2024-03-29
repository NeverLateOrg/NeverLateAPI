import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public start_date: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public end_date: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public location?: string;

  @ApiProperty({ required: false, enum: ['UserCustomLocation', 'UserPlaceLocation'] })
  @IsEnum(['UserCustomLocation', 'UserPlaceLocation'])
  @IsOptional()
  public savedLocationType?: 'UserCustomLocation' | 'UserPlaceLocation';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public savedLocation?: string;
}
