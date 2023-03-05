import { OmitType } from '@nestjs/mapped-types';
import { EventDTO } from './Event.dto';

export class CreateEventDTO extends OmitType(EventDTO, ['_id', '__v'] as const) {}
