import { CommentDto } from '../comments/dto/comment.dto';

export class CreateNewsDto {
  id?: number;
  title: string;
  description: string;
  author: string;
  countViews?: number;
  comments?: CommentDto[];
  cover?: string;
}
