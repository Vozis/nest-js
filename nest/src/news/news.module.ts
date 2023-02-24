import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { UsersModule } from '../users/users.module';
import { CommentsEntity } from './comments/entities/comments.entity';
import { UsersEntity } from '../users/entities/user.entity';
import { CommentsModule } from './comments/comments.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([NewsEntity]),
    UsersModule,
    CommentsModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
