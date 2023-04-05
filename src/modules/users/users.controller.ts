import { Body, Controller, Get, Req, Put, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { Request } from 'express';
import { JwtGuard } from '../authentification/guard';

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
  async getMe(@Req() req: Request): Promise<any> {
    return req.user;
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
