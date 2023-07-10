import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { FlexEvent, FlexEventDocument } from './schemas/flex-event.schema';

export class FlexEventsRepository extends EntityRepository<FlexEventDocument> {
  constructor(@InjectModel(FlexEvent.name) private readonly EventModel: Model<FlexEventDocument>) {
    super(EventModel);
  }
}
