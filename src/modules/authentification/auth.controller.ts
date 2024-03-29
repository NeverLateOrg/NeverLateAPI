import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { TokenDTO } from './dtos/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User registered successfully and JWT token generated',
    type: TokenDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload or email already registered',
  })
  @Post('register')
  public async register(@Body() registerDto: RegisterDTO): Promise<TokenDTO> {
    const token = new TokenDTO();
    token.access_token = await this.authService.register(registerDto);
    return token;
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User logged in successfully and JWT token generated',
    type: TokenDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @HttpCode(200)
  public async login(@Body() loginDto: LoginDTO): Promise<TokenDTO> {
    const token = new TokenDTO();
    token.access_token = await this.authService.login(loginDto);
    return token;
  }
}
