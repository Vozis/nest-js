import { Injectable } from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { getRandomInt } from '../../utils/getRandom';
import { CommentReply, Comments } from './comment.interface';
import { IdNewsDto } from '../dto/id-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  private readonly comments = {
    1: [
      {
        id: 6784,
        message: 'Hello, world!',
        author: 'User',
        avatar:
          'https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=612x612&w=0&k=20&c=GVYAgYvyLb082gop8rg0XC_wNsu0qupfSLtO7q9wu38=',
      },
    ],
  };

  async create(idNews: number, comment: CreateCommentDto, idComment?: number) {
    if (!idComment) {
      if (!this.comments[idNews]) {
        this.comments[idNews] = [];
      }

      if (!comment.avatar) {
        comment.avatar =
          'https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=612x612&w=0&k=20&c=GVYAgYvyLb082gop8rg0XC_wNsu0qupfSLtO7q9wu38=';
      }

      this.comments[idNews].push({
        id: getRandomInt(),
        ...comment,
      });
      return comment;
    }

    return this.findCommentAndReply(this.comments, idComment, comment);
  }

  findAll(idNews: number): Comments | undefined {
    if (this.comments[idNews]) {
      return this.comments[idNews];
    }

    // return 'Комментарии не найдены';
  }

  async updateComment(
    idNews: number,
    idComment: number,
    dto: UpdateCommentDto,
  ): Promise<Comments> {
    if (!this.comments[idNews]) {
      return null;
    }
    return this.findAndEdit(this.comments, idComment, dto);
  }

  async remove(idNews: number, idComment: number): Promise<boolean> {
    if (!this.comments[idNews]) {
      return null;
    }
    const commentIndex = this.comments[idNews].findIndex(
      (c) => c.id === idComment,
    );
    if (commentIndex !== -1) {
      this.comments[idNews].splice(commentIndex, 1);
      return true;
    }

    return false;
  }

  async removeAll(idNews: number): Promise<boolean> {
    return delete this.comments?.[idNews];
  }

  private findCommentAndReply(
    comments,
    idComment: number,
    comment: CreateCommentDto,
  ) {
    for (const property in comments) {
      if (comments.hasOwnProperty(property)) {
        if (typeof comments[property] === 'object') {
          this.findCommentAndReply(comments[property], idComment, comment);
        }
        if (comments[property] == idComment) {
          if (!comments['reply']) {
            comments['reply'] = [];
          }
          if (!comment.avatar) {
            comment.avatar =
              'https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=612x612&w=0&k=20&c=GVYAgYvyLb082gop8rg0XC_wNsu0qupfSLtO7q9wu38=';
          }
          comments['reply'].push({
            id: getRandomInt(),
            ...comment,
          });
          return comment;
        }
      }
    }
  }

  private findAndEdit(comments, idComment, comment) {
    for (const property in comments) {
      if (comments.hasOwnProperty(property)) {
        if (typeof comments[property] == 'object') {
          this.findAndEdit(comments[property], idComment, comment);
        }
        if (comments[property] == idComment) {
          comments = {
            ...comments,
            ...comment,
          };
          return comments;
        }
        return comments;
      }
    }
  }
}

/*
async create(
  idNews: number,
  comment: CommentWithReplyDto,
  idComment?: string,
): Promise<CommentWithReplyDto> {
  if (!this.comments[idNews]) {
  this.comments[idNews] = [];
}

const parentCommentIndex = this.comments[idNews].findIndex(
  (el) => el.id === comment.id,
);

if (parentCommentIndex !== -1) {
  this.comments[idNews][parentCommentIndex] = {
    ...this.comments[idNews][parentCommentIndex],
    reply: [
      ...this.comments[idNews][parentCommentIndex].reply,
      {
        ...comment,
        id: getRandomInt(),
      },
    ],
  };
  return this.comments[idNews][parentCommentIndex];
}

this.comments[idNews].push({
  ...comment,
  id: getRandomInt(),
  reply: [],
});
return comment;
}*/
