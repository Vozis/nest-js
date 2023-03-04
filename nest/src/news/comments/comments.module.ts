import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './entities/comments.entity';
import { UsersModule } from '../../users/users.module';
import { NewsModule } from '../news.module';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    UsersModule,
    forwardRef(() => NewsModule),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, SocketCommentsGateway],
  exports: [CommentsService],
})
export class CommentsModule {}
