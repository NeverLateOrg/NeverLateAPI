import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBase64, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SuccessTemplateDto } from 'src/utils/dto/template.dto';
import { ConstraintDto } from './constraint.dto';

export class FlexEventDto {
  static from(data: any): FlexEventDto {
    return new FlexEventDto(data.id, data.name, data.min_date, data.max_date, data.constraints, data.event);
  }

  constructor(id: string, name: string, minDate: Date, maxDate: Date, constraints: ConstraintDto[], event?: string) {
    this.id = id;
    this.name = name;
    this.min_date = minDate;
    this.max_date = maxDate;
    this.constraints = constraints;
    this.event = event;
  }

  @ApiProperty({ type: String })
  @IsBase64()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsBase64()
  event?: string;

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

export class FlexEventsResponseDto extends SuccessTemplateDto<FlexEventDto[]> {
  @ApiProperty({ type: [FlexEventDto] })
  data: FlexEventDto[];
}
