import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth()
@ApiTags('auth')
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

  // VIEW =================================================================

  @Get('login')
  @Render('auth/login')
  async renderLogin() {
    return { layout: 'auth', title: 'Авторизация' };
  }
}
