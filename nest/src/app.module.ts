import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { StudyModule } from './study/study.module';

@Module({
  imports: [NewsModule, StudyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
