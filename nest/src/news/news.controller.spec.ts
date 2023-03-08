import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsEntity } from './entities/news.entity';
import { Role } from '../auth/role/role.enum';

describe('NewsController', () => {
  let newsController: NewsController;
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [NewsService],
    }).compile();

    newsController = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(newsController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of news', async () => {
      const result: NewsEntity[] = [
        {
          id: 5,
          title: 'Новость 101010',
          description: 'Самая лучшая новость на планете',
          cover: '/static/c1bf4721-e7b8-413e-895a-a6b16e2586f4.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 3,
            firstName: 'Test',
            lastName: 'Testovish',
            email: 'user@test.ru',
            password:
              '$2b$10$t1V5YPBV/jIUyi5igVuJJeJN2dco5ubkDaO/9xBfiri34gCgb5qY6',
            avatar: '/static/93d37259-4c5e-4db3-a810-e7151b14a377.jpg',
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: 'user',
          },
        },
      ];

      const userId = 3;
      jest.spyOn(newsService, 'getAll').mockImplementation(async () => result);

      expect(await newsController.getAll(userId)).toBe(result);
    });
  });
});
