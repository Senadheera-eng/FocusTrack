import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: { userId: string; email: string } }) {
    const user = await this.usersService.findById(req.user.userId);
    return {
      userId: req.user.userId,
      email: req.user.email,
      username: user?.username || null,
      profilePicture: user?.profilePicture || null,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request & { user: { userId: string; email: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(req.user.userId, dto);
    return {
      userId: user.id,
      email: user.email,
      username: user.username || null,
      profilePicture: user.profilePicture || null,
    };
  }
}