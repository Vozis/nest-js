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
  Query,
  Render,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { CommentsService } from './comments/comments.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/helperFileLoader';
import { imageFileFilter } from '../utils/imageFileFilter';
import { MailService } from '../mail/mail.service';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsEntity } from './entities/news.entity';
import { isEmpty } from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const PATH_NEWS = '/static/';
const helperFileLoaderNews = new HelperFileLoader();
helperFileLoaderNews.path = PATH_NEWS;

@ApiBearerAuth()
@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newService: NewsService,
    private readonly mailService: MailService,
    private readonly commentsService: CommentsService,
  ) {}

  // API =================================================

  @ApiOperation({ summary: 'Get all news' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'News all',
    type: [NewsEntity],
  })
  @Get('api/all')
  async getAll(userId): Promise<NewsEntity[]> {
    return this.newService.getAll(userId);
  }

  @Get('api/details/:idNews')
  async getOneNews(
    @Param('idNews', ParseIntPipe) idNews: number,
  ): Promise<NewsEntity> {
    const news = await this.newService.findById(idNews);

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
      ...news,
    };
  }

  @ApiOperation({ summary: 'Create news' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'News created',
    type: NewsEntity,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'forbidden',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Moderator, Role.User)
  @Post('api')
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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Put('api/:id')
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
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNewsDto,
    @UploadedFiles() coverUpdate: Express.Multer.File,
  ) {
    const previousNews = await this.newService.findById(id);

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
    const updatedNews = await this.newService.update(id, dto);

    // if (typeof updatedNews === 'object') {
    //   await this.mailService.sendEditNewsForAdmins(
    //     ['sizov.ilya1996@gmail.com'],
    //     previousNews,
    //     updatedNews,
    //   );
    // }

    return updatedNews;
  }

  @Delete('api/:id')
  async removeNews(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const isRemoved = await this.newService.remove(id);

    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'Новость удалена' : 'Передан неверный id',
      },
      HttpStatus.OK,
    );
  }

  // VIEW ===============================================================================================================

  @Get('all')
  @Render('news-list')
  async getAllView(@Query() params) {
    let userId;
    if (isEmpty(params)) {
      userId = 0;
    }
    userId = params.userId;
    const news = await this.newService.getAll(userId);
    return {
      news,
      title: 'Список новостей',
    };
  }

  @Get('details/:id')
  @Render('news-detail')
  async getOneNewsView(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const news = await this.newService.findById(id);

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
      title: 'Самая лучшая новость',
    };
  }

  @Get('create/new')
  @Render('create-news')
  async createNewsView() {
    return {
      title: 'Создание новости',
    };
  }
}
