import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PlaceBasicsDTO {
  @Expose()
  @ApiProperty()
  placeId: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  address: string;
}
