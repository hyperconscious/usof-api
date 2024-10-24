import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
@Check(`"entity_type" = 'post' OR "entity_type" = 'comment'`)
@Check(`"type" = 'like' OR "type" = 'dislike'`)
@Unique(['user', 'post', 'comment'])
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ type: 'timestamp', name: 'publish_date' })
  publishDate!: Date;

  @Column({ default: 'post', name: 'entity_type' })
  entityType!: 'post' | 'comment';

  @ManyToOne(() => Post, post => post.likes, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post?: Post;

  @ManyToOne(() => Comment, comment => comment.likes, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment?: Comment;

  @Column({ default: 'like' })
  type!: 'like' | 'dislike';
}
