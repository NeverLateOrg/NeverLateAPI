import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @Exclude()
  public _id: string;

  @Exclude()
  public __v: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  public email: string;
}
