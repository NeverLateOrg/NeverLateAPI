import { PickType } from '@nestjs/mapped-types';
import { EventDTO } from './event.dto';

export class DeleteEventDTO extends PickType(EventDTO, ['_id'] as const) {}
