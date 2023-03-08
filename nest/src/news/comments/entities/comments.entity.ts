import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../../users/entities/user.entity';
import { NewsEntity } from '../../entities/news.entity';

@Entity({ name: 'comments' })
@Tree('closure-table')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => UsersEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: UsersEntity;

  @ManyToOne(() => NewsEntity, (news) => news.comments, {
    onDelete: 'CASCADE',
  })
  news: NewsEntity;

  @TreeChildren()
  children: CommentsEntity[];

  @TreeParent({
    onDelete: 'CASCADE',
  })
  parent: CommentsEntity;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
