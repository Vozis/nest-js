import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
