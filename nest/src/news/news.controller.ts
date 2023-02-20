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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { CommentsService } from './comments/comments.service';
import { renderNewsAll } from '../views/news/news-all';
import { htmlTemplate } from '../views/template';
import { renderNewsOne } from '../views/news/news-one';
import { AllNews, News, NewsEdit } from './news.interface';
import { IdNewsDto } from './dto/id-news.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/helperFileLoader';

const PATH_NEWS = '/news-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

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
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
  async createNews(
    @Body() dto: CreateNewsDto,
    @UploadedFiles() cover: Express.Multer.File,
  ): Promise<AllNews> {
    console.log(cover);
    if (cover[0]?.filename) {
      dto.cover = PATH_NEWS + cover[0].filename;
    }
    return this.newService.createNews(dto);
  }

  @Put('api/news/:idNews')
  async updateNews(@Param() params: IdNewsDto, @Body() dto: NewsEdit) {
    const intId = +params.idNews;
    return this.newService.update(intId, dto);
  }

  @Delete('api/news/:idNews')
  async removeNews(@Param() idNews: IdNewsDto): Promise<string> {
    const intId = +idNews.idNews;
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
