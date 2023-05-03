import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { UserPlaceLocation, UserPlaceLocationDocument } from './schemas/user.location.place.schema';

@Injectable()
export class UserPlaceLocationsRepository extends EntityRepository<UserPlaceLocationDocument> {
  constructor(@InjectModel(UserPlaceLocation.name) UserPlaceLocationModel: Model<UserPlaceLocationDocument>) {
    super(UserPlaceLocationModel);
  }
}
