import { Module } from '@nestjs/common';
import { GooglePlaceController } from './google.controller';
import { GoogleMapsClientProvider } from './google.map.provider';
import { GoogleService } from './google.service';

@Module({
  imports: [],
  controllers: [GooglePlaceController],
  providers: [GoogleService, GoogleMapsClientProvider],
  exports: [GoogleService],
})
export class GoogleModule {}
