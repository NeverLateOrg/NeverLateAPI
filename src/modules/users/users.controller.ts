import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import toDTO from 'src/utils/dtoConvertor';
import { GetUser } from '../authentification/decorator/';
import { JwtGuard } from '../authentification/guard';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { User } from './user.schema';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @ApiOkResponse({
    description: 'Current user retrieved successfully',
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: User): Promise<UserDTO> {
    return toDTO(UserDTO, user);
  }

  @ApiOkResponse({
    description: 'Current user updated successfully',
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  @UseGuards(JwtGuard)
  @Put('me')
  public async updateMe(@GetUser() user: User, @Body() updateUserDto: UpdateUserDTO): Promise<UserDTO> {
    return toDTO(UserDTO, user);
  }
}
