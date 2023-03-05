import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString({
    message: 'Поле должно быть строкой',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((o) => o.cover)
  cover: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
