import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import toDTO from 'src/utils/dtoConvertor';
import { TransformObjectId } from 'src/utils/transformers';
import { Travel } from '../Storage/storage.schema';

export class TravelDTO {
  public static build(travel: Travel): TravelDTO {
    return toDTO(TravelDTO, travel);
  }

  @Expose()
  @ApiProperty()
  @TransformObjectId('fromEvent')
  fromEvent: string;

  @Expose()
  @ApiProperty()
  duration: number;

  @Expose()
  @ApiProperty()
  departureDate: Date;
}
