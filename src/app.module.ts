import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:12341234@localhost/neverlate?authSource=admin'), UserModule],
})
export class AppModule {}
