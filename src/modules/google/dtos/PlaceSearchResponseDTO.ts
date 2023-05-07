import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import toDTO from 'src/utils/dtoConvertor';
import { PlaceBasics } from '../google.service';
import { PlaceBasicsDTO } from './PlaceBasicsDTO';

export class PlaceSearchResponseDTO {
  public static build(places: PlaceBasics[], nextPageToken?: string): PlaceSearchResponseDTO {
    return toDTO(PlaceSearchResponseDTO, { places, nextPageToken });
  }

  @ApiPropertyOptional()
  @Expose()
  nextPageToken?: string;

  @Expose()
  @Type(() => PlaceBasicsDTO)
  @ApiProperty({ type: [PlaceBasicsDTO] })
  places: PlaceBasicsDTO[];
}
