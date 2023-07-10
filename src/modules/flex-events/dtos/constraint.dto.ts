import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConstraintDto {
  static from(data: any): ConstraintDto {
    return Object.assign(new ConstraintDto(), data);
  }

  @ApiProperty({ type: String })
  @IsString()
  type: string;

  [key: string]: any;
}
