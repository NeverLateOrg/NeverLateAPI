import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserDTO } from 'src/modules/users/dtos/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO extends UserDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  public email: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsOptional()
  public lastname: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsOptional()
  public firstname: string;
}
