import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventsIcsDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public url: string;
}
