import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString({ message: 'Поле message должно быть строкой' })
  message: string;
}
