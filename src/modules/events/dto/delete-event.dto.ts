import { PickType } from '@nestjs/swagger';
import { EventDTO } from './event.dto';

export class DeleteEventDTO extends PickType(EventDTO, ['_id'] as const) {}
