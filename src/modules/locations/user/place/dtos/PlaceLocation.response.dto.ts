import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WeekOpeningPeriodResponseDTO } from 'src/modules/locations/dtos/weekOpeningPeriod.response.dto';
import toDTO from 'src/utils/dtoConvertor';
import { TransformObjectId } from 'src/utils/transformers';
import { UserPlaceLocation } from '../schemas/user.location.place.schema';

export class PlaceLocationResponseDTO {
  public static build(location: UserPlaceLocation): PlaceLocationResponseDTO {
    return toDTO(PlaceLocationResponseDTO, {
      _id: location._id,
      placeLocationId: location.placeLocation._id,
      name: location.placeLocation.name,
      address: location.placeLocation.address,
      openingHours: location.placeLocation.opening_hours,
    });
  }

  @Expose()
  @ApiProperty()
  @TransformObjectId()
  public _id: string;

  @Expose()
  @ApiProperty()
  @TransformObjectId(['placeLocationId'])
  public placeLocationId: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public address: string;

  @Expose()
  @ApiProperty({ required: false })
  public openingHours?: WeekOpeningPeriodResponseDTO;
}