import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

// This is the default Event DTO
// It must only be used as a base class for other DTOs
export class EventDTO {
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsDate()
  @Type(() => Date)
  public start_date: Date;

  @IsDate()
  @Type(() => Date)
  public end_date: Date;
}
