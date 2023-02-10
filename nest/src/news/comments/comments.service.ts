import { Injectable } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { getRandomInt } from '../news.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly comments = {};

  async create(idNews: number, comment: CommentDto): Promise<CommentDto> {
    if (!this.comments[idNews]) {
      this.comments[idNews] = [];
    }
    this.comments[idNews].push({
      ...comment,
      id: getRandomInt(),
    });
    return comment;
  }

  findAll(idNews: number): CommentDto[] | undefined {
    return this.comments[idNews];
  }

  updateComment(
    idNews: number,
    idComment: number,
    dto: UpdateCommentDto,
  ): CommentDto[] {
    if (!this.comments[idNews]) {
      return null;
    }

    const commentEditIndex = this.comments[idNews].findIndex(
      (el) => el.id === idComment,
    );

    if (commentEditIndex !== -1) {
      this.comments[idNews][commentEditIndex] = {
        ...this.comments[idNews][commentEditIndex],
        ...dto,
      };

      return this.comments[idNews];
    }
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
}
