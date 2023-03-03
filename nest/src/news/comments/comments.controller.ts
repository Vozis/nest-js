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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsEntity } from './entities/comments.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('api/:idNews')
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() message: string,
    @Req() req,
  ) {
    const jwtUserId = req.user.userId;
    return this.commentsService.create(idNews, message, jwtUserId);
  }

  @Put('api/:idComment')
  async UpdateComment(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() dto: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    return this.commentsService.updateComment(idComment, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/:idNews/:idComment')
  deleteComment(
    @Param('idComment', ParseIntPipe) idComment: number,
  ): Promise<CommentsEntity> {
    return this.commentsService.remove(idComment);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/:idNews')
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
