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
  public firstname: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  public lastname: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  public email: string;
}
