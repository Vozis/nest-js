import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Поле message должно быть строкой' })
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsOptional()
  commentId: number;

  // @IsString()
  // @IsNotEmpty()
  // newsId: string;
}
