import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
@Unique(['author', 'post', 'comment'])
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  author!: User;

  @CreateDateColumn({ type: 'timestamp', name: 'publish_date' })
  publishDate!: Date;

  @Column({ default: 'post', name: 'entity_type' })
  entityType!: 'post' | 'comment';

  @ManyToOne(() => Post, { nullable: true })
  post?: Post;

  @ManyToOne(() => Comment, { nullable: true })
  comment?: Comment;

  @Column({ default: 'like' })
  type!: 'like' | 'dislike';
}
