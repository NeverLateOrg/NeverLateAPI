import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TransformObjectId } from 'src/utils/transformers';
import { User } from '../schemas/user.schema';

export class UserDTO {
  static toDto(user: User): UserDTO {
    const formateTrusted = user.trustedUsers.map((trustedUser) => ({
      _id: trustedUser._id.toString(),
      firstName: trustedUser.firstName,
      lastName: trustedUser.lastName,
      email: trustedUser.email,
    }));
    return {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      // @ts-expect-error
      trustedUsers: formateTrusted,
    };
  }

  @Expose()
  @ApiProperty()
  @TransformObjectId()
  public _id: string;

  @Exclude()
  public __v: number;

  @ApiProperty()
  @Expose()
  public firstName: string;

  @ApiProperty()
  @Expose()
  public lastName: string;

  @ApiProperty()
  @Expose()
  public email: string;

  @Expose()
  @ApiProperty({ type: [UserDTO] })
  @ValidateNested()
  public trustedUsers: UserDTO[];
}
