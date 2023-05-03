import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import toDTO from 'src/utils/dtoConvertor';
import { WeekOpeningPeriod } from '../schemas/weekOpeningPeriod.schema';
import { OpeningPeriodResponseDTO } from './openingPeriod.response.dto';

export class WeekOpeningPeriodResponseDTO {
  public static build(weekOpeningPeriod: WeekOpeningPeriod): WeekOpeningPeriodResponseDTO {
    return toDTO(WeekOpeningPeriodResponseDTO, weekOpeningPeriod);
  }

  @Expose()
  @ApiProperty()
  @ApiProperty({
    isArray: true,
    type: OpeningPeriodResponseDTO,
  })
  @Type(() => OpeningPeriodResponseDTO)
  public periods: OpeningPeriodResponseDTO[];
}
