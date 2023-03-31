import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current user retrieved successfully',
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  public async getMe(): Promise<UserDTO> {
    return new UserDTO();
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
