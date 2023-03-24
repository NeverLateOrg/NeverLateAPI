import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Travels, TravelsSchema } from './storage.schema';
import { TravelsStorageService } from './storage.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Travels.name, schema: TravelsSchema }])],
  providers: [TravelsStorageService],
  controllers: [],
})
export class TravelsStorageModule {}
