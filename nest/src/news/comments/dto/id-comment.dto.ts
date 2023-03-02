import { IsNotEmpty, IsString } from 'class-validator';
import { IdNewsDto } from '../../dto/id-news.dto';

export class IdCommentDto {
  @IsString()
  @IsNotEmpty()
  idComment: string;
}

export class IdBothDto {
  idComment: IdCommentDto;
  idNews: IdNewsDto;
}
