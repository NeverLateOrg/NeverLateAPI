/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(@Body() user: any, @Res() res): Promise<void> {
    const result = await this.usersService.addUser(user.name, user.email, user.password);
    res.status(200).send(result);
    // return result;
  }

  @Get()
  async getUser(@Body() user: any, @Res() res): Promise<void> {
    const result = await this.usersService.getUser(user.email);
    if (result.includes('not found')) res.status(404).send(result);
    res.status(200).send(result);
  }
}
