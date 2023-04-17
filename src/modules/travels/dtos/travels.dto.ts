import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Travel } from '../Storage/storage.schema';

export class TravelDTO {
  public static build(travel: Travel): TravelDTO {
    console.log(travel);
    const dto = new TravelDTO();
    dto.fromEvent = travel.fromEvent.id;
    dto.duration = travel.duration;
    return dto;
  }

  @Expose()
  @ApiProperty()
  fromEvent: string;

  @Expose()
  @ApiProperty()
  duration: number;
}

export type TravelsDTO = TravelDTO[];
