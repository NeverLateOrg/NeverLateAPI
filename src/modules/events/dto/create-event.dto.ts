import { OmitType } from '@nestjs/mapped-types';
import { EventDTO } from './event.dto';

export class CreateEventDTO extends OmitType(EventDTO, ['_id'] as const) {}
