import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:12341234@localhost/neverlate?authSource=admin'), UsersModule],
})
export class AppModule {}
