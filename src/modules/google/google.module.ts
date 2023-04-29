import { Module } from '@nestjs/common';
import { GoogleMapsClientProvider } from './google.map.provider';
import { GoogleService } from './google.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GoogleService, GoogleMapsClientProvider],
  exports: [GoogleService],
})
export class GoogleModule {}
