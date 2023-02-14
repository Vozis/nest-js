export interface Comment {
  id?: number;
  message: string;
  author: string;
}

export interface CommentReply {
  id?: number;
  message?: string;
  author?: string;
  reply?: Comment[];
}
