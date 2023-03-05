import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDTO } from './Create-event.dto';

export class UpdateEventDTO extends PartialType(CreateEventDTO) {}
