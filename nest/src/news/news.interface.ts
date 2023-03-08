import { Comments } from './comments/comment.interface';

export type News = {
  id?: number;
  title: string;
  description: string;
  author: string;
  countViews?: number;
  cover?: string;
  comments?: Comments;
};

export type AllNews = Record<string, News>;

export type NewsEdit = Partial<Omit<News, 'id'>>;
