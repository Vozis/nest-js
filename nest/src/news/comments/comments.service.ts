import { Injectable } from '@nestjs/common';
import { CommentDto, CommentWithReplyDto } from './dto/comment.dto';
import { getRandomInt } from '../news.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly comments = {};

  async create(
    idNews: number,
    comment: CommentWithReplyDto,
    idComment?: number,
  ) {
    if (!idComment) {
      if (!this.comments[idNews]) {
        this.comments[idNews] = [];
      }

      this.comments[idNews].push({
        ...comment,
        id: getRandomInt(),
      });
      return comment;
    }
    return this.findCommentAndReply(this.comments, idComment, comment);
  }

  findAll(idNews: number): CommentDto[] | undefined {
    return this.comments[idNews];
  }

  async updateComment(
    idNews: number,
    idComment: number,
    dto: UpdateCommentDto,
  ): Promise<CommentWithReplyDto[]> {
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

  private findCommentAndReply(comments, idComment, comment) {
    for (const property in comments) {
      if (comments.hasOwnProperty(property)) {
        if (typeof comments[property] === 'object') {
          this.findCommentAndReply(comments[property], idComment, comment);
        }
        if (comments[property] == idComment) {
          if (!comments['reply']) {
            comments['reply'] = [];
          }
          comments['reply'].push({
            ...comment,
            id: getRandomInt(),
          });
          return comment;
        }
      }
    }
  }

  private findAndEdit(comments, idComment, comment) {
    for (const property in comments) {
      if (comments.hasOwnProperty(property)) {
        if (typeof comments[property] === 'object') {
          this.findAndEdit(comments[property], idComment, comment);
        }
        if (comments[property] == idComment) {
          comments = {
            ...comments,
            ...comment,
          };
          console.log(comments);
          return comments;
        }
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
