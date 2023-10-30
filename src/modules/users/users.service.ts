import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserFromId(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  async getUserFromIdWithPerm(user: User, id: string): Promise<User | null> {
    const searchUser = await this.usersRepository.findById(id);
    if (searchUser == null) return null;
    if (searchUser.trustedUsers.includes(user._id)) return searchUser;
    throw new UnauthorizedException('You are not trusted by this user');
  }

  async getUserFromMail(mail: string): Promise<User | null> {
    return await this.usersRepository.findOne({ email: mail });
  }

  async generateShareId(user: User): Promise<string> {
    // jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SHARE_SECRET ?? 'qwdqwd', { expiresIn: '1h' });
    return token;
  }

  async verifToken(token: string): Promise<{ id: string }> {
    return await new Promise<{ id: string }>((resolve, reject) => {
      jwt.verify(token, process.env.JWT_USER_SHARE_SECRET ?? 'qwdqwd', (err, decoded: { id: string }) => {
        if (err != null) reject(err);
        resolve(decoded);
      });
    });
  }

  async addTrustedUser(user: User, token: string): Promise<void> {
    let payload: { id: string };
    try {
      payload = await this.verifToken(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
    const userDoc = await this.usersRepository.findById(user._id);
    const trustedUser = await this.usersRepository.findById(payload.id);
    if (trustedUser == null) throw new Error('User not found');
    if (userDoc == null) throw new Error('User not found');

    if (trustedUser.trustedUsers == null) trustedUser.trustedUsers = [];
    if (userDoc.trustedUsers == null) userDoc.trustedUsers = [];
    if (userDoc.id === trustedUser.id) throw new BadRequestException("You can't add yourself");
    if (userDoc.trustedUsers.includes(trustedUser._id)) throw new BadRequestException('User already trusted');
    if (trustedUser.trustedUsers.includes(userDoc._id)) throw new BadRequestException('User already trusted');
    userDoc.trustedUsers.push(trustedUser._id);
    trustedUser.trustedUsers.push(userDoc._id);
    await userDoc.save();
    await trustedUser.save();
  }
}
