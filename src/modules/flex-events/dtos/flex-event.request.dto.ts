import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ConstraintDto } from './constraint.dto';

export class FlexEventRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  min_date: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  max_date: Date;

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

  @ApiProperty({ type: [ConstraintDto] })
  @ValidateNested()
  constraints: ConstraintDto[];
}
