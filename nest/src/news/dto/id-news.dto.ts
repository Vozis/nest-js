import { IsNotEmpty, IsString } from 'class-validator';

export class IdNewsDto {
  @IsString({ message: 'id Должно быть строкой' })
  @IsNotEmpty({ message: 'Поле id не должно быть пустым' })
  idNews: string;
}
