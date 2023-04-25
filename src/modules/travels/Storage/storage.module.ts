import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/modules/events/events.module';
import { TravelsCalculatorModule } from '../Calculator/calculator.module';
import { Travels, TravelsSchema } from './storage.schema';
import { TravelsStorageService } from './storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Travels.name, schema: TravelsSchema }]),
    TravelsCalculatorModule,
    forwardRef(() => EventsModule),
  ],
  providers: [TravelsStorageService],
  controllers: [],
  exports: [TravelsStorageService],
})
export class TravelsStorageModule {}
