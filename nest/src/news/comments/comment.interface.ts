export interface Comment {
  message: string;
  author: string;
  id?: number;
  avatar?: string;
}

export interface CommentReply extends Partial<Comment> {
  reply?: Comment[];
}
export type CommentEdit = Partial<CommentReply>;

export type Comments = Record<string | number, CommentReply>;
