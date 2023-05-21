import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Event, EventStatus } from 'src/modules/events/schemas/event.schema';
import { CustomLocationResponseDTO } from 'src/modules/locations/user/custom/dtos/CustomLocation.response.dto';
import { UserCustomLocation } from 'src/modules/locations/user/custom/schemas/user.location.custom.schema';
import { PlaceLocationResponseDTO } from 'src/modules/locations/user/place/dtos/PlaceLocation.response.dto';
import { UserPlaceLocation } from 'src/modules/locations/user/place/schemas/user.location.place.schema';
import { TravelDTO } from 'src/modules/travels/dtos/travels.dto';
import { Travels } from 'src/modules/travels/Storage/storage.schema';
import toDTO from 'src/utils/dtoConvertor';
import { TransformObjectId } from 'src/utils/transformers';

export class ResponseEventDTO {
  public static build(event: Event, travels: Travels | null): ResponseEventDTO {
    let savedLocation: any;
    if (event.savedLocationType !== undefined) {
      savedLocation =
        event.savedLocationType === 'UserCustomLocation'
          ? CustomLocationResponseDTO.build(event.savedLocation as UserCustomLocation)
          : PlaceLocationResponseDTO.build(event.savedLocation as UserPlaceLocation);
    }

    return toDTO(
      ResponseEventDTO,
      event,
      {
        travels: travels === null ? [] : travels.travels.map((travel) => TravelDTO.build(travel)),
      },
      {
        savedLocation,
      },
    );
  }

  @Expose()
  @ApiProperty()
  @TransformObjectId()
  public _id: string;

  @Expose()
  @ApiProperty()
  public title: string;

  @Expose()
  @ApiProperty()
  public start_date: Date;

  @Expose()
  @ApiProperty()
  public end_date: Date;

  @Expose()
  @ApiProperty({ required: false })
  public location?: string;

  @Expose()
  @ApiProperty({ required: false, enum: ['UserCustomLocation', 'UserPlaceLocation'] })
  public savedLocationType?: 'UserCustomLocation' | 'UserPlaceLocation';

  @Expose()
  @ApiProperty({
    required: false,
  })
  public savedLocation?: CustomLocationResponseDTO | PlaceLocationResponseDTO;

  @Expose()
  @ApiProperty({ enum: Object.values(EventStatus) })
  public status: string;

  @Expose()
  @ApiProperty({ required: false, type: [TravelDTO] })
  @Type(() => TravelDTO)
  public travels?: TravelDTO[];
}
