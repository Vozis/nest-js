export class CommentDto {
  message: string;
  author: string;
  id?: number;
}

export class CommentWithReplyDto extends CommentDto {
  reply?: CommentDto[];
}
