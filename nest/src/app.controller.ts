import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return {
      messages: [
        { message: 'Hello', author: 'Ilya' },
        { message: 'Hello', author: 'user' },
      ],
    };
  }
}
