import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SharedIdDTO {
  @ApiProperty({ type: String })
  @IsString()
  token: string;
}
