import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateEventDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  public start_date: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  public end_date: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public location?: string;
}
