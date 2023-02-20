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
  Redirect,
  Render,
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
import { imageFileFilter } from '../utils/imageFileFilter';
import { MailService } from '../mail/mail.service';
import { UpdateNewsDto } from './dto/update-news.dto';

const PATH_NEWS = '/static/';
const helperFileLoaderNews = new HelperFileLoader();
helperFileLoaderNews.path = PATH_NEWS;

@Controller()
export class NewsController {
  constructor(
    private readonly newService: NewsService,
    private readonly commentService: CommentsService,
    private readonly mailService: MailService,
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
        destination: helperFileLoaderNews.destinationPath,
        filename: helperFileLoaderNews.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createNews(
    @Body() dto: CreateNewsDto,
    @UploadedFiles() cover: Express.Multer.File,
  ): Promise<News> {
    if (cover[0]?.filename) {
      dto.cover = PATH_NEWS + cover[0].filename;
    }
    const _news = await this.newService.createNews(dto);
    await this.mailService.sendNewNewsForAdmins(
      ['sizov.ilya1996@gmail.com'],
      _news,
    );

    return _news;
  }

  @Put('api/news/:idNews')
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoaderNews.destinationPath,
        filename: helperFileLoaderNews.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateNews(
    @Param() params: IdNewsDto,
    @Body() dto: UpdateNewsDto,
    @UploadedFiles() coverUpdate: Express.Multer.File,
  ) {
    const intId = +params.idNews;
    const previousNews = await this.newService.find(intId);

    if (coverUpdate[0]?.filename) {
      dto.cover = PATH_NEWS + coverUpdate[0].filename;
    }
    const updatedNews = await this.newService.update(intId, dto);

    if (typeof updatedNews === 'object') {
      await this.mailService.sendEditNewsForAdmins(
        ['sizov.ilya1996@gmail.com'],
        previousNews,
        updatedNews,
      );
    }

    return updatedNews;
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
  @Render('news-list')
  async getAllView() {
    const news = await this.newService.getAll();
    console.log(news);
    return { news, title: 'Список новостей' };

    // const content = renderNewsAll(news);
    // return htmlTemplate(content, {
    //   title: 'Список новостей',
    //   description: 'Самые крутые новости на свете ',
    // });
  }

  @Get('view/news/:idNews/detail')
  @Render('news-detail')
  async getOneNewsView(@Param() params: IdNewsDto) {
    const intId = +params.idNews;
    const news = await this.newService.find(intId);
    const comments = this.commentService.findAll(intId);

    return {
      news,
      comments,
      title: 'Самая лучшая новость',
    };

    // const content = renderNewsOne(news, comments);
    // return htmlTemplate(content, {
    //   title: 'Новость',
    //   description: `Самая лучшая новость`,
    // });
  }

  @Get('view/news/create')
  @Render('create-news')
  async createNewsView() {
    return {
      title: 'Создание новости',
    };
  }
}
