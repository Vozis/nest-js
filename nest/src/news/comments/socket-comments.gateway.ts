import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { WsJwtGuard } from '../../auth/ws-jwt.guard';
import { OnEvent } from '@nestjs/event-emitter';
import { EventComment } from './event-comment.enum';

export type Comment = {
  message: string;
  idNews: number;
};

@WebSocketGateway()
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly commentsService: CommentsService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleMessage(client: Socket, comment: Comment) {
    const { idNews, message } = comment;
    const userId: number = client.data.user.id;
    const _comment = await this.commentsService.create(
      +idNews,
      message,
      userId,
    );

    this.server.to(idNews.toString()).emit('newComment', _comment);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @OnEvent(EventComment.REMOVE)
  handleRemoveCommentEvent(payload) {
    const { commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  @OnEvent(EventComment.EDIT)
  handleEditCommentEvent(payload) {
    const { comment, commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('updateComment', {
      id: commentId,
      comment,
    });
    this.server.to(newsId.toString()).emit('message', {
      message: 'Комментарий изменен',
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { newsId } = client.handshake.query;
    client.join(newsId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
