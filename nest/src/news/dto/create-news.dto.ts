import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({
    message: 'Поле должно быть строкой',
  })
  @IsNotEmpty()
  description: string;


  @IsString()
  @ValidateIf((o) => o.cover)
  cover: string;


  @IsString()
  @IsNotEmpty()
  userId: string;
}
