import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  public email: string;
}
