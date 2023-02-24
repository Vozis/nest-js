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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentReply, Comments } from './comment.interface';
import { IdNewsDto } from '../dto/id-news.dto';
import { IdBothDto, IdCommentDto } from './dto/id-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../../utils/helperFileLoader';
import { imageFileFilter } from '../../utils/imageFileFilter';
import { CommentsEntity } from './entities/comments.entity';
import { NewsService } from '../news.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('api/details/:idNews')
  async findAllCommentsForNews(
    @Param('idNews', ParseIntPipe) idNews: number,
  ): Promise<CommentsEntity[]> {
    const comments = await this.commentsService.findAll(idNews);

    if (comments.length == 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарии отсутствуют',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return comments;
  }

  @Post('api/:idNews')
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(idNews, dto);
  }

  @Put('api/:idComment')
  async UpdateComment(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() dto: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    return this.commentsService.updateComment(idComment, dto);
  }

  @Delete('api/comments/:idComment')
  deleteComment(
    @Param('idComment', ParseIntPipe) idComment: number,
  ): Promise<CommentsEntity> {
    return this.commentsService.remove(idComment);
  }

  @Delete('api/comments/:idNews')
  deleteAll(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.commentsService.removeAll(idNews);
  }

  /*@Post('api/comments/:idNews/:idComment')
  replyToComment(
    @Param() idNews: IdNewsDto,
    @Param() idComment: IdCommentDto,
    @Body() dto: CreateCommentDto,
  ) {
    const idNewsInt = +idNews.idNews;
    const idCommentInt = +idComment.idComment;

    if (!avatarReply) {
    }

    console.log(dto);
    return this.commentsService.create(idNewsInt, dto, idCommentInt);
  }*/
}
