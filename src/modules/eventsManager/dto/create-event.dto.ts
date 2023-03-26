import { OmitType } from '@nestjs/swagger';
import { EventDTO } from './event.dto';

export class CreateEventDTO extends OmitType(EventDTO, ['_id'] as const) {}
