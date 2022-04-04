import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authDto: AuthDto): Promise<User> {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authDto);
  }
}
