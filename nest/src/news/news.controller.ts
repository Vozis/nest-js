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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CommentsService } from './comments/comments.service';
import { renderNewsAll } from '../views/news/news-all';
import { htmlTemplate } from '../views/template';
import { renderNewsOne } from '../views/news/news-one';
import { AllNews, News, NewsEdit } from './news.interface';
import { IdNewsDto } from './dto/id-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/helperFileLoader';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { log } from 'util';

const PATH_NEWS = '/static/news/';
const helperFileLoaderNews = new HelperFileLoader();
helperFileLoaderNews.path = PATH_NEWS;

@UseInterceptors(LoggingInterceptor)
@Controller()
export class NewsController {
  constructor(
    private readonly newService: NewsService,
    private readonly commentService: CommentsService,
  ) {}

  // API =================================================

  @Get('api/news/all')
  async getAll(): Promise<AllNews> {
    return this.newService.getAll();
  }

  @Get('api/news/:idNews')
  async getOneNews(@Param() params: IdNewsDto): Promise<News | Error> {
    const intId = +params.idNews;
    const news = await this.newService.find(intId);
    const comments = this.commentService.findAll(intId);

    return {
      ...news,
      comments: comments,
    };
  }

  @Post('api/news/')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoaderNews.destinationPath,
        filename: helperFileLoaderNews.customFileName,
      }),
    }),
  )
  async createNews(
    @Body() dto: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ): Promise<AllNews> {
    if (cover?.filename) {
      dto.cover = PATH_NEWS + cover.filename;
    }
    return this.newService.createNews(dto);
  }

  @Put('api/news/:id')
  async updateNews(@Param('id') params: IdNewsDto, @Body() dto: NewsEdit) {
    const intId = +params.idNews;
    return this.newService.update(intId, dto);
  }

  @Delete('api/news/:id')
  async removeNews(@Param() params: IdNewsDto): Promise<string> {
    const intId = +params.idNews;
    const isRemoved =
      (await this.newService.remove(intId)) &&
      (await this.commentService.removeAll(intId));
    return isRemoved ? 'Новость удалена' : 'Передан неверный id';
  }

  // VIEW =================================================

  @Get('view/news/')
  async getAllView(): Promise<string> {
    const news = await this.newService.getAll();
    const content = renderNewsAll(news);
    return htmlTemplate(content, {
      title: 'Список новостей',
      description: 'Самые крутые новости на свете ',
    });
  }

  @Get('view/news/:idNews/detail')
  async getOneNewsView(@Param() params: IdNewsDto): Promise<string> {
    const intId = +params.idNews;
    const news = await this.newService.find(intId);
    const comments = this.commentService.findAll(intId);
    const content = renderNewsOne(news, comments);
    return htmlTemplate(content, {
      title: 'Новость',
      description: `Самая лучшая новость`,
    });
  }
}
