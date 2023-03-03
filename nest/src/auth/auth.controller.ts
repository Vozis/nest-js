import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token, id, role } = await this.authService.login(req.user);
    response.cookie('jwt', access_token, {
      httpOnly: true,
    });
    response.cookie('userId', id);
    response.cookie('role', role);
    return access_token;
  }
}
