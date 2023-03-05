import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/user.entity';
import { CommentsEntity } from '../comments/entities/comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'news' })
export class NewsEntity {
  @ApiProperty({ example: 'Id новости', description: 'News id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Новость дня', description: 'News title' })
  @Column('text')
  title: string;

  @ApiProperty({ example: 'Описание новости', description: 'News description' })
  @Column('text')
  description: string;

  @ApiProperty({
    example: 'Путь к обложке новости',
    description: 'path to news cover',
  })
  @Column('text', {
    nullable: true,
  })
  cover: string;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
