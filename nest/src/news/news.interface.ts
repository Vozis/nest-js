import { CommentReply } from './comments/comment.interface';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countViews?: number;
  comments?: CommentReply[];
  cover?: string;
  createAt?: string;
}

export interface NewsEdit extends Partial<News> {}
