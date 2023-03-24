/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../../events/schemas/event.schema';
import { TravelsCalculatorService } from '../Calculator/calculator.service';
import { Travels, TravelsDocument } from './storage.schema';

@Injectable()
export class TravelsStorageService {
  constructor(
    @InjectModel(Travels.name) private readonly TravelsModel: Model<TravelsDocument>,
    private readonly travelsCalculatorService: TravelsCalculatorService,
  ) {}

  private async deleteTravels(event: Event): Promise<boolean> {
    return (await this.TravelsModel.deleteOne({ destinationEvent: event })).deletedCount > 0;
  }

  public async setTravels(destinationEvent: Event, previousEvents: Event[]): Promise<any> {
    await this.deleteTravels(destinationEvent);
    return await this.TravelsModel.create({
      destinationEvent,
      travels: previousEvents.map((pe) => ({ fromEvent: pe })),
    });
  }
}
