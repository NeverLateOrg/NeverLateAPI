import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Event } from 'src/modules/events/schemas/event.schema';
import { TravelDTO } from 'src/modules/travels/dtos/travels.dto';
import { Travels } from 'src/modules/travels/Storage/storage.schema';
import toDTO from 'src/utils/dtoConvertor';
import { TransformObjectId } from 'src/utils/transformers';

export class ResponseEventDTO {
  public static build(event: Event, travels: Travels | null): ResponseEventDTO {
    return toDTO(ResponseEventDTO, event, {
      travels: travels === null ? [] : travels.travels.map((travel) => TravelDTO.build(travel)),
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
  public start_date: Date;

  @Expose()
  @ApiProperty()
  public end_date: Date;

  @Expose()
  @ApiProperty({ required: false })
  public location?: string;

  @Expose()
  @ApiProperty({ required: false, type: [TravelDTO] })
  @Type(() => TravelDTO)
  public travels?: TravelDTO[];
}
