import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenDTO {
  @ApiProperty()
  @IsString()
  public access_token: string;
}
