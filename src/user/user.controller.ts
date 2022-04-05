import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getMe(@GetUser() user: User): User {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() edituserDto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(userId, edituserDto);
  }
}
