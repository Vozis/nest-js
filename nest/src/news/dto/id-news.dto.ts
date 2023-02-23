import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IdNewsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Поле id не должно быть пустым' })
  idNews: number;
}
