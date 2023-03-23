import { EventDTO } from './event.dto';

export type UpdateEventDTO = Partial<EventDTO> & Pick<EventDTO, '_id'>;
