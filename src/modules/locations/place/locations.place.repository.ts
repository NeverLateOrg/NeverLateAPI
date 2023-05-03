import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { PlaceLocation, PlaceLocationDocument } from './schemas/location.place.schema';

@Injectable()
export class PlaceLocationRepository extends EntityRepository<PlaceLocationDocument> {
  constructor(@InjectModel(PlaceLocation.name) PlaceLocationModel: Model<PlaceLocationDocument>) {
    super(PlaceLocationModel);
  }
}
