import { Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import toDTO from 'src/utils/dtoConvertor';
import { GetUser } from '../authentification/decorator/';
import { JwtGuard } from '../authentification/guard';
import { SharedIdDTO } from './dtos/shared-id.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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

  @ApiOkResponse({
    type: SharedIdDTO,
  })
  @UseGuards(JwtGuard)
  @Get('share-id')
  public async getShareId(@GetUser() user: User): Promise<SharedIdDTO> {
    const shareId = await this.userService.generateShareId(user);
    return { token: shareId };
  }

  @UseGuards(JwtGuard)
  @Post('share-id')
  public async addTrustedUser(@GetUser() user: User, @Body() token: SharedIdDTO): Promise<void> {
    console.log(token);
    console.log(token.token);
    await this.userService.addTrustedUser(user, token.token);
  }

  @ApiOkResponse({
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiBadRequestResponse({})
  @UseGuards(JwtGuard)
  @Get(':id')
  async getUser(@GetUser() user: User, @Param('id') id): Promise<UserDTO> {
    const userDoc = await this.userService.getUserFromIdWithPerm(user, id);
    if (userDoc == null) throw new NotFoundException('User not found');
    return toDTO(UserDTO, userDoc);
  }
}
