import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, ValidateNested } from 'class-validator';
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

  @ApiProperty({ type: [ConstraintDto] })
  @ValidateNested()
  constraints: ConstraintDto[];
}
