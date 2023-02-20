import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Поле message должно быть строкой' })
  message: string;

  @IsString({ message: 'Поле author должно быть строкой' })
  author: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
