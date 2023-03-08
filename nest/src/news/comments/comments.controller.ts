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
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NewsEntity } from '../entities/news.entity';

@ApiBearerAuth()
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'get comments for news' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'comment for news got',
    type: NewsEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'news not found',
  })
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

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'comment created',
    type: NewsEntity,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'forbidden',
  })
  @UseGuards(JwtAuthGuard)
  @Post('api/:idNews')
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
    @Req() req,
  ) {
    const jwtUserId = req.user.userId;
    return this.commentsService.create(idNews, comment, jwtUserId);
  }

  @ApiOperation({ summary: 'update comments' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'comment created',
    type: NewsEntity,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'forbidden',
  })
  @UseGuards(JwtAuthGuard)
  @Put('api/:idComment')
  async UpdateComment(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() dto: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    return this.commentsService.updateComment(idComment, dto);
  }

  @ApiOperation({ summary: 'delete comments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'comment deleted',
    type: NewsEntity,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'forbidden',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('api/:idNews/:idComment')
  deleteComment(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Req() req,
  ): Promise<CommentsEntity> {
    const userId = req.user.userId;
    return this.commentsService.remove(idComment, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/:idNews')
  deleteAll(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.commentsService.removeAll(idNews);
  }
}
