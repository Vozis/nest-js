import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

export function getRandomInt(min: number = 1, max: number = 9999): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

@Injectable()
export class NewsService {
  private readonly news: CreateNewsDto[] = [
    {
      id: 1,
      title: 'news 1',
      description: 'this is news 1',
      author: 'User',
      cover:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT91bLZ_uuyT35AFwAb_dwQ9k9XgOAdy296g47XGCNF&s',
    },
  ];

  async createNews(news: CreateNewsDto): Promise<CreateNewsDto[]> {
    const id = getRandomInt(0, 9999);
    const finalNews = {
      ...news,
      id: id,
    };
    this.news.push(finalNews);
    return this.news;
  }

  async find(id: CreateNewsDto['id']): Promise<CreateNewsDto> {
    try {
      const found = await this.news.find((news) => news.id === id);
      return found;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async getAll(): Promise<CreateNewsDto[]> {
    return this.news;
  }

  async update(
    id: UpdateNewsDto['id'],
    dto: UpdateNewsDto,
  ): Promise<CreateNewsDto> {
    const elEditIndex = this.news.findIndex((el) => el.id === id);
    if (elEditIndex !== -1) {
      this.news[elEditIndex] = {
        ...this.news[elEditIndex],
        ...dto,
      };
      return this.news[elEditIndex];
    }

    // const array = this.news.map((obj) => {
    //   if (obj.id === id) {
    //     return {
    //       ...obj,
    //       ...dto,
    //     };
    //   }
    //   return obj;
    // });
    // this.news = [...array];
    // // тут выводит старый почему то, но по факту апдейт делает
    // return this.news[id];
  }

  async remove(id: CreateNewsDto['id']): Promise<Boolean> {
    try {
      const indexRemoveNews = this.news.findIndex((news) => news.id === id);
      if (indexRemoveNews !== -1) {
        this.news.splice(indexRemoveNews, 1);
        return true;
      }
      return false;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
