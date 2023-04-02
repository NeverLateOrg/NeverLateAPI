import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

// This is the default Event DTO
// It must only be used as a base class for other DTOs
export class EventDTO {
  @Exclude()
  public _id: string;

  @Exclude()
  public __v: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsDate()
  @Type(() => Date)
  public start_date: Date;

  @Expose()
  @IsDate()
  @Type(() => Date)
  public end_date: Date;

  @Expose()
  @IsString()
  public location?: string;
}