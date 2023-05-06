import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from 'src/database/entity.repository';
import { UserCustomLocation, UserCustomLocationDocument } from './schemas/user.location.custom.schema';

@Injectable()
export class UserCustomLocationsRepository extends EntityRepository<UserCustomLocationDocument> {
  constructor(@InjectModel(UserCustomLocation.name) UserCustomLocationModel: Model<UserCustomLocationDocument>) {
    super(UserCustomLocationModel);
  }
}
