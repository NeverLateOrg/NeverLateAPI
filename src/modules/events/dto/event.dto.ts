import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

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
