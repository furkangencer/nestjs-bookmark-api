import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto): Promise<User> {
    console.log(authDto);
    return this.authService.signup(authDto);
  }

  @Post('signin')
  signin(@Body() authDto: AuthDto): Promise<User> {
    return this.authService.signin(authDto);
  }
}
