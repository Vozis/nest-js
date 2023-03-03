import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './entities/comments.entity';
import { Repository } from 'typeorm';

import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventComment } from './event-comment.enum';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    @Inject(forwardRef(() => NewsService))
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    idNews: number,
    comment: string,
    userId: number,
    idComment?: number,
  ) {
    if (!idComment) {
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
      const _user = await this.usersService.findOne(userId);

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
      createdComment.message = comment;
      createdComment.user = _user;
      createdComment.news = _news;
      const newComment = await this.commentsRepository.create(createdComment);

      return this.commentsRepository.save(newComment);
    }

    // return this.findCommentAndReply(this.comments, idComment, comment);
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
    return this.commentsRepository.find({
      where: {
        news: {
          id: idNews,
        },
      },
      relations: ['user'],
    });
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

  async remove(id: number): Promise<CommentsEntity> {
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

  // private findCommentAndReply(
  //   comments,
  //   idComment: number,
  //   comment: CreateCommentDto,
  // ) {
  //   for (const property in comments) {
  //     if (comments.hasOwnProperty(property)) {
  //       if (typeof comments[property] === 'object') {
  //         this.findCommentAndReply(comments[property], idComment, comment);
  //       }
  //       if (comments[property] == idComment) {
  //         if (!comments['reply']) {
  //           comments['reply'] = [];
  //         }
  //         if (!comment.avatar) {
  //           comment.avatar =
  //             'https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=612x612&w=0&k=20&c=GVYAgYvyLb082gop8rg0XC_wNsu0qupfSLtO7q9wu38=';
  //         }
  //         comments['reply'].push({
  //           id: getRandomInt(),
  //           ...comment,
  //         });
  //         return comment;
  //       }
  //     }
  //   }
  // }

  // private findAndEdit(comments, idComment, comment) {
  //   for (const property in comments) {
  //     if (comments.hasOwnProperty(property)) {
  //       if (typeof comments[property] == 'object') {
  //         this.findAndEdit(comments[property], idComment, comment);
  //       }
  //       if (comments[property] == idComment) {
  //         comments = {
  //           ...comments,
  //           ...comment,
  //         };
  //         return comments;
  //       }
  //       return comments;
  //     }
  //   }
  // }
}
