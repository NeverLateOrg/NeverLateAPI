import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TransformObjectId } from 'src/utils/transformers';

export class UserDTO {
  @Exclude()
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
}
