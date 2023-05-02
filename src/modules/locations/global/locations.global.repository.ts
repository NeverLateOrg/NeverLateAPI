import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { LocationDocument } from './schemas/location.global.schema';

@Injectable()
export class LocationsGlobalRepository extends EntityRepository<LocationDocument> {
  constructor(@InjectModel(Location.name) LocationModel: Model<LocationDocument>) {
    super(LocationModel);
  }
}
