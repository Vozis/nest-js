import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { getRandomInt } from '../utils/getRandom';
import { News, NewsEdit } from './news.interface';

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: 1,
      title: 'news 1',
      description: 'this is news 1',
      author: 'User',
      cover:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT91bLZ_uuyT35AFwAb_dwQ9k9XgOAdy296g47XGCNF&s',
    },
  ];

  async createNews(news: News): Promise<News[]> {
    const id = getRandomInt(0, 9999);
    const finalNews = {
      ...news,
      id: id,
    };
    this.news.push(finalNews);
    return this.news;
  }

  async find(id: News['id']): Promise<News> {
    const found = await this.news.find((news) => news.id === id);
    return found;
  }

  async getAll(): Promise<News[]> {
    return this.news;
  }

  async update(id: News['id'], dto: NewsEdit): Promise<News> {
    const elEditIndex = this.news.findIndex((el) => el.id === id);
    if (elEditIndex !== -1) {
      this.news[elEditIndex] = {
        ...this.news[elEditIndex],
        ...dto,
      };
      return this.news[elEditIndex];
    }
  }

  async remove(id: News['id']): Promise<boolean> {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }
    return false;
  }
}
