import { Injectable } from '@nestjs/common';
import { ResponseEventDTO } from '../events/dto';

@Injectable()
export class EventsManagerService {
  public async CreateEvent(userId: string): Promise<ResponseEventDTO> {
    return new ResponseEventDTO();
  }

  public async UpdateEvent(): Promise<ResponseEventDTO> {
    return new ResponseEventDTO();
  }

  public async GetEvent(): Promise<ResponseEventDTO> {
    return new ResponseEventDTO();
  }

  public async GetUserEvents(): Promise<ResponseEventDTO> {
    return new ResponseEventDTO();
  }

  public async DeleteEvent(): Promise<boolean> {
    return false;
  }

  public async GetNextEvents(): Promise<ResponseEventDTO[]> {
    const nextEvents: ResponseEventDTO[] = [];
    return nextEvents;
  }

  public async GetPreviousEvents(): Promise<ResponseEventDTO[]> {
    const previousEvents: ResponseEventDTO[] = [];
    return previousEvents;
  }
}
