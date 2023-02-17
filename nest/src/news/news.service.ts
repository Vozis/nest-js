import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { getRandomInt } from '../utils/getRandom';
import { AllNews, News, NewsEdit } from './news.interface';

@Injectable()
export class NewsService {
  private readonly news: AllNews = {
    1: {
      id: 1,
      title: 'news 1',
      description: 'this is news 1',
      author: 'User',
      countViews: 12,
      cover:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT91bLZ_uuyT35AFwAb_dwQ9k9XgOAdy296g47XGCNF&s',
    },
  };

  async createNews(news: News): Promise<AllNews> {
    const id = getRandomInt(0, 9999);
    const finalNews = {
      ...news,
      id: id,
    };
    this.news[id] = finalNews;
    return this.news;
  }

  async find(id: News['id']): Promise<News> {
    if (this.news[id]) {
      return this.news[id];
    }
  }

  async getAll(): Promise<AllNews> {
    return this.news;
  }

  async update(id: News['id'], newsEdit: NewsEdit): Promise<News | string> {
    if (this.news[id]) {
      this.news[id] = {
        ...this.news[id],
        ...newsEdit,
      };

      return this.news[id];
    }

    return 'Новость не найдена';
  }

  async remove(id: News['id']): Promise<boolean> {
    if (this.news[id]) {
      delete this.news[id];
      return true;
    }

    return false;
  }
}
