import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDTO } from 'src/modules/users/dtos/user.dto';

export class LoginDTO extends PickType(UserDTO, ['email'] as const) {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;
}
