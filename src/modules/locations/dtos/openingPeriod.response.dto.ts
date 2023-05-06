/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import toDTO from 'src/utils/dtoConvertor';
import { OpeningPeriod, WeekDate } from '../schemas/openingPeriod.schema';

class WeekDateResponseDTO implements WeekDate {
  @Expose()
  @ApiProperty()
  public day: number;

  @ApiProperty()
  @Expose()
  public time: string;
}

export class OpeningPeriodResponseDTO {
  public static build(openingPeriod: OpeningPeriod): OpeningPeriodResponseDTO {
    return toDTO(OpeningPeriodResponseDTO, openingPeriod);
  }

  @Expose()
  @ApiProperty()
  public open: WeekDateResponseDTO;

  @Expose()
  @ApiProperty({ required: false })
  public close?: WeekDateResponseDTO;
}
