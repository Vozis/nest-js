import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './entities/comments.entity';
import { Repository, TreeRepository } from 'typeorm';

import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventComment } from './event-comment.enum';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { checkPermission, Modules } from '../../utils/check-permission';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: TreeRepository<CommentsEntity>,
    @Inject(forwardRef(() => NewsService))
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(idNews: number, comment: CreateCommentDto, userId: number) {
    const _news = await this.newsService.findById(idNews);

    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.usersService.findById(userId);

    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const createdComment = new CommentsEntity();
    createdComment.message = comment.message;
    createdComment.user = _user;
    createdComment.news = _news;

    if (!comment.commentId) {
      const newComment = await this.commentsRepository.create(createdComment);

      return this.commentsRepository.save(newComment);
    }

    const parent = await this.findById(comment.commentId);
    const child = await this.commentsRepository.create(createdComment);
    child.parent = parent;

    // const a = await this.commentsRepository.findTrees();
    // console.log(a);
    return this.commentsRepository.save(child);
  }

  async updateComment(
    id: number,
    commentsEdit: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: {
        id,
      },
      relations: ['news', 'user'],
    });
    _comment.message = commentsEdit.message;

    const updatedComment = await this.commentsRepository.save(_comment);

    this.eventEmitter.emit(EventComment.EDIT, {
      comment: updatedComment,
      commentId: _comment.id,
      newsId: _comment.news.id,
    });

    return updatedComment;

    // if (!this.comments[idNews]) {
    //   return null;
    // }
    // return this.findAndEdit(this.comments, idComment, dto);
  }

  async findAll(idNews: number): Promise<CommentsEntity[]> {
    const comments = await this.commentsRepository.find({
      where: {
        news: {
          id: idNews,
        },
      },
      relations: ['user'],
    });

    const parents = await this.commentsRepository.findTrees({
      relations: ['user', 'news'],
    });

    return parents;
  }

  async findById(id: number): Promise<CommentsEntity> {
    return this.commentsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        news: true,
      },
    });
  }

  async remove(id: number, userId: number): Promise<CommentsEntity> {
    const _comment = await this.findById(id);

    if (!_comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарий не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const _user = await this.usersService.findById(userId);

    if (
      _user.id !== _comment.user.id &&
      !checkPermission(Modules.editComment, _user.roles)
    ) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Недостаточно прав для удаления',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    this.eventEmitter.emit(EventComment.REMOVE, {
      commentId: _comment.id,
      newsId: _comment.news.id,
    });

    return this.commentsRepository.remove(_comment);
  }

  async removeAll(idNews: number) {
    const removedComments = await this.findAll(idNews);
    return this.commentsRepository.remove(removedComments);
  }
}
