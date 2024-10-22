import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  author!: User;

  @CreateDateColumn({ type: 'timestamp', name: 'publish_date' })
  publishDate!: Date;

  @Column('text')
  @IsNotEmpty({ message: 'Content is required' })
  content!: string;

  @Column({ default: 0 })
  likes!: number;

  @ManyToOne(() => Post, { eager: true })
  @IsNotEmpty({ message: 'Comment needed to be under post.' })
  post!: Post;
}
