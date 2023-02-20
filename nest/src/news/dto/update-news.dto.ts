import { IsOptional, IsString } from 'class-validator';

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
