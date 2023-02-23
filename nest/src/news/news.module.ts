import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    CommentsModule,
    MailModule,
    TypeOrmModule.forFeature([NewsEntity]),
    UsersModule,
  ],
})
export class NewsModule {}
