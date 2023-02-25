import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from './comments/comments.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/role/roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([NewsEntity]),
    UsersModule,
    CommentsModule,
    AuthModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
