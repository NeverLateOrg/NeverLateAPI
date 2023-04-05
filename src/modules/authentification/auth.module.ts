import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './middleware';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), JwtModule.register({})],
  providers: [UsersService, AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
