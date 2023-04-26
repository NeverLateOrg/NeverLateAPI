import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
