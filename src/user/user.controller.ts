import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async addUser(): Promise<string> {
    const result = await this.userService.addUser('Pierre', 'pierre@gmail.com');
    return result;
  }
}
