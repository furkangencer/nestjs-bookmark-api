import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(authDto: AuthDto): Promise<User> {
    const hash = await argon.hash(authDto.password);
    const user = await this.prismaService.user
      .create({
        data: {
          email: authDto.email,
          hash,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ForbiddenException('Email already in use');
          }
        }
        throw err;
      });

    delete user.hash;
    return user;
  }

  async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid email or password');
    }
    const validPassword = await argon.verify(user.hash, authDto.password);
    if (!validPassword) {
      throw new ForbiddenException('Invalid email or password');
    }
    const accessToken = await this.signToken({
      userId: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  private signToken(jwtPaylaod: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPaylaod);
  }
}
