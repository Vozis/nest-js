import { IsNotEmpty, IsString } from 'class-validator';

export class IdNewsDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
