import { IsOptional, IsString } from 'class-validator';
import { CommentsEntity } from '../comments/entities/comments.entity';

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  cover: string;
}
