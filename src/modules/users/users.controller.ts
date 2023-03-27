/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';

import * as dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JTW_SECRET_KEY;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: any, @Res() res): Promise<void> {
    const result = await this.usersService.createUser(user.firstname, user.lastname, user.email, user.password);

    if (result === null) res.status(409).send(result);
    else res.status(201).send(result);
  }

  @Get()
  async getUser(@Body() user: any, @Res() res): Promise<void> {
    const result = await this.usersService.getUser(user.email);
    if (result === null) res.status(404).send(result);
    res.status(200).send(result);
  }

  @Post('login')
  async loginUser(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string; user: any; token: any }> {
    const user = await this.usersService.loginUser(body.email, body.password);
    if (user == null) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '48h' });
    user.token = token;
    return { message: 'Logged in successfully', user, token };
  }
}
