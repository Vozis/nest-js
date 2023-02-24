import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Поле message должно быть строкой' })
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  // @IsString()
  // @IsNotEmpty()
  // newsId: string;
}
