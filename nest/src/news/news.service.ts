import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { getRandomInt } from '../utils/getRandom';
import { AllNews, News, NewsEdit } from './news.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createNews(dto: CreateNewsDto): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = dto.title;
    newsEntity.description = dto.description;
    newsEntity.cover = dto.cover;
    const _user = await this.usersService.findOne(+dto.userId);
    newsEntity.user = _user;
    const news = await this.newsRepository.create(newsEntity);
    return this.newsRepository.save(news);
  }
  async findById(id: number): Promise<NewsEntity> {
    return this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async update(
    id: News['id'],
    newsEdit: UpdateNewsDto,
  ): Promise<NewsEntity | string> {
    // return this.newsRepository.update('news', 1, {
    //   ...newsEdit,
    // });
    let updatedNews = await this.newsRepository.findOneBy({
      id,
    });

    if (!updatedNews) {
      return 'Новость не найдена';
    }

    updatedNews = {
      ...updatedNews,
      ...newsEdit,
    };

    return this.newsRepository.save(updatedNews);
  }

  async remove(id: News['id']): Promise<NewsEntity | string> {
    const removedNews = await this.newsRepository.findOneBy({
      id,
    });
    if (!removedNews) {
      return 'Новость не найдена';
    }

    return this.newsRepository.remove(removedNews);
  }
}
