import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('api/comments/:idNews')
  create(
    @Param('idNews') idNews: string,
    @Body() dto: CommentDto,
  ): Promise<CommentDto> {
    const idNewsInt = +idNews;
    return this.commentsService.create(idNewsInt, dto);
  }

  @Get('api/comments/:idNews')
  findAll(@Param('idNews') idNews: string): CommentDto[] {
    const idNewsInt = +idNews;
    return this.commentsService.findAll(idNewsInt);
  }

  @Delete('api/comments/:idNews/:idComment')
  deleteComment(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
  ): Promise<boolean> {
    const idNewsInt = +idNews;
    const idCommentInt = +idComment;
    return this.commentsService.remove(idNewsInt, idCommentInt);
  }

  @Delete('api/comments/:idNews')
  deleteAll(@Param('idNews') idNews: string) {
    const idNewsInt = +idNews;
    return this.commentsService.removeAll(idNewsInt);
  }

  @Put('api/comments/:idNews/:idComment')
  UpdateComment(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
    @Body() dto: UpdateCommentDto,
  ): CommentDto[] {
    const idNewsInt = +idNews;
    const idCommentInt = +idComment;
    return this.commentsService.updateComment(idNewsInt, idCommentInt, dto);
  }
}
