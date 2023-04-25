import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserFromId(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  async getUserFromMail(mail: string): Promise<User | null> {
    return await this.usersRepository.findOne({ email: mail });
  }
}
