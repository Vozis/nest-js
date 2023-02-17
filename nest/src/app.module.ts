import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { StudyModule } from './study/study.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    NewsModule,
    StudyModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

/*export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}*/
export class AppModule {}
