import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentReply, Comments } from './comment.interface';
import { IdNewsDto } from '../dto/id-news.dto';
import { IdBothDto, IdCommentDto } from './dto/id-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../../utils/helperFileLoader';

const PATH_COMMENTS = '/static/comments/';
const helperFileLoaderComment = new HelperFileLoader();
helperFileLoaderComment.path = PATH_COMMENTS;

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('api/comments/:idNews')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoaderComment.destinationPath,
        filename: helperFileLoaderComment.customFileName,
      }),
    }),
  )
  create(
    @Param() params: IdNewsDto,
    @Body() dto: CreateCommentDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const idNewsInt = +params.idNews;

    if (avatar?.filename) {
      dto.avatar = PATH_COMMENTS + avatar.filename;
    }

    return this.commentsService.create(idNewsInt, dto);
  }

  @Post('api/comments/:idNews/:idComment')
  replyToComment(
    @Param() idNews: IdNewsDto,
    @Param() idComment: IdCommentDto,
    @Body() dto: CreateCommentDto,
  ) {
    const idNewsInt = +idNews.idNews;
    const idCommentInt = +idComment.idComment;
    return this.commentsService.create(idNewsInt, dto, idCommentInt);
  }

  @Get('api/comments/:idNews')
  findAll(@Param() params: IdNewsDto): Comments {
    const intIdNews = +params.idNews;
    return this.commentsService.findAll(intIdNews);
  }

  @Delete('api/comments/:idNews/:idComment')
  deleteComment(@Param() params: IdBothDto): Promise<boolean> {
    const idNewsInt = +params.idNews;
    const idCommentInt = +params.idComment;
    return this.commentsService.remove(idNewsInt, idCommentInt);
  }

  @Delete('api/comments/:idNews')
  deleteAll(@Param() params: IdNewsDto) {
    const idNewsInt = +params.idNews;
    return this.commentsService.removeAll(idNewsInt);
  }

  @Put('api/comments/:idNews/:idComment')
  UpdateComment(
    @Param() params: IdBothDto,
    @Body() dto: UpdateCommentDto,
  ): Promise<Comments> {
    const idNewsInt = +params.idNews;
    const idCommentInt = +params.idComment;
    return this.commentsService.updateComment(idNewsInt, idCommentInt, dto);
  }
}
