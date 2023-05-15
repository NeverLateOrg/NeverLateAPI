import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WeekOpeningPeriodResponseDTO } from 'src/modules/locations/dtos/weekOpeningPeriod.response.dto';
import toDTO from 'src/utils/dtoConvertor';
import { TransformObjectId } from 'src/utils/transformers';
import { UserCustomLocation } from '../schemas/user.location.custom.schema';

export class CustomLocationResponseDTO {
  public static build(location: UserCustomLocation): CustomLocationResponseDTO {
    return toDTO(CustomLocationResponseDTO, location, {
      opening_hours:
        location.openingHours !== undefined ? WeekOpeningPeriodResponseDTO.build(location.openingHours) : undefined,
    });
  }

  @Expose()
  @ApiProperty()
  @TransformObjectId()
  public _id: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public location: string;

  @Expose()
  @ApiProperty({ required: false })
  public opening_hours?: WeekOpeningPeriodResponseDTO;
}
