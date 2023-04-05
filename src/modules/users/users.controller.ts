import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { JwtGuard } from '../authentification/guard';
import { GetUser } from '../authentification/decorator/';

@ApiTags('User')
@Controller('users')
export class UsersController {
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current user retrieved successfully',
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: UserDTO): Promise<any> {
    return user;
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current user updated successfully',
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  @Put('me')
  public async updateMe(@Body() updateUserDto: UpdateUserDTO): Promise<UserDTO> {
    return new UserDTO();
  }
}
