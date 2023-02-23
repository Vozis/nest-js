import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { NewsEntity } from './entities/news.entity';

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
  async getAll(): Promise<NewsEntity[]> {
    return this.newService.getAll();
  }

  @Get('api/news/:idNews')
  async getOneNews(
    @Param('idNews', ParseIntPipe) idNews: number,
  ): Promise<NewsEntity | Error> {
    const news = await this.newService.findById(idNews);

    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'error',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    // const comments = this.commentService.findAll(intId);

    return {
      ...news,
      // comments: comments,
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
  ): Promise<NewsEntity> {
    if (cover[0]?.filename) {
      dto.cover = PATH_NEWS + cover[0].filename;
    }
    const _news = await this.newService.createNews(dto);
    // await this.mailService.sendNewNewsForAdmins(
    //   ['sizov.ilya1996@gmail.com'],
    //   _news,
    // );

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
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() dto: UpdateNewsDto,
    @UploadedFiles() coverUpdate: Express.Multer.File,
  ) {
    const previousNews = await this.newService.findById(idNews);

    if (!previousNews) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (coverUpdate[0]?.filename) {
      dto.cover = PATH_NEWS + coverUpdate[0].filename;
    }
    const updatedNews = await this.newService.update(idNews, dto);

    // if (typeof updatedNews === 'object') {
    //   await this.mailService.sendEditNewsForAdmins(
    //     ['sizov.ilya1996@gmail.com'],
    //     previousNews,
    //     updatedNews,
    //   );
    // }

    return updatedNews;
  }

  @Delete('api/news/:idNews')
  async removeNews(
    @Param('idNews', ParseIntPipe) idNews: number,
  ): Promise<string> {
    const isRemoved =
      (await this.newService.remove(idNews)) &&
      (await this.commentService.removeAll(idNews));

    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'Новость удалена' : 'Передан неверный id',
      },
      HttpStatus.OK,
    );
  }

  // VIEW =================================================

  @Get('view/news/')
  @Render('news-list')
  async getAllView() {
    const news = await this.newService.getAll();
    return { news, title: 'Список новостей' };
  }

  @Get('view/news/:idNews/detail')
  @Render('news-detail')
  async getOneNewsView(@Param('idNews', ParseIntPipe) idNews: number) {
    const news = await this.newService.findById(idNews);
    const comments = this.commentService.findAll(idNews);

    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      news,
      comments,
      title: 'Самая лучшая новость',
    };
  }

  @Get('view/news/create')
  @Render('create-news')
  async createNewsView() {
    return {
      title: 'Создание новости',
    };
  }
}
