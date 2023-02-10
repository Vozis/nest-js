import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CommentsService } from './comments/comments.service';
import { renderNewsAll } from '../views/news/news-all';
import { htmlTemplate } from '../views/template';

@Controller()
export class NewsController {
  constructor(
    private readonly newService: NewsService,
    private readonly commentService: CommentsService,
  ) {}

  @Get('api/news/all')
  async getAll(): Promise<CreateNewsDto[]> {
    return this.newService.getAll();
  }

  @Get('view/news/')
  async getAllView() {
    const news = await this.newService.getAll();
    const content = renderNewsAll(news);
    return htmlTemplate(content, {
      title: 'Список новостей',
      description: 'Самые крутые новости на свете ',
    });
  }

  @Get('api/news/:id')
  async getOneNews(@Param('id') id: string): Promise<CreateNewsDto | Error> {
    const intId = +id;
    const news = await this.newService.find(intId);
    const comments = this.commentService.findAll(intId);
    return {
      ...news,
      comments: comments,
    };
  }

  @Post('api/news/')
  async createNews(@Body() dto: CreateNewsDto): Promise<CreateNewsDto[]> {
    return this.newService.createNews(dto);
  }

  @Put('api/news/:id')
  async updateNews(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    const intId = +id;
    return this.newService.update(intId, dto);
  }

  @Delete('api/news/:id')
  async removeNews(@Param('id') id: string): Promise<string> {
    const intId = +id;
    const isRemoved =
      (await this.newService.remove(intId)) &&
      (await this.commentService.removeAll(intId));
    return isRemoved ? 'Новость удалена' : 'Передан неверный id';
  }
}
