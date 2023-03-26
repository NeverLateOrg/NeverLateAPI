import { PartialType } from '@nestjs/mapped-types';
import { EventDTO } from './event.dto';

export class UpdateEventDTO extends PartialType(EventDTO) {
  public _id: string;
}
