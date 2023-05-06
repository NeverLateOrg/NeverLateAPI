import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlaceLocationRequestDTO {
  @ApiProperty()
  @IsString()
  public placeId: string;
}
