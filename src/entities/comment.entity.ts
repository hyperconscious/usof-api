import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { IsNotEmpty } from 'class-validator';

export enum CommentStatus {
  active = 'active',
  inactive = 'inactive',
}
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  author!: User;

  @CreateDateColumn({ type: 'timestamp', name: 'publish_date' })
  publishDate!: Date;

  @Column('text')
  @IsNotEmpty({ message: 'Content is required' })
  content!: string;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.active,
  })
  status!: CommentStatus;

  @OneToMany(() => Like, (like) => like.comment)
  likes!: Like[];

  @Column({ default: 0, name: 'likes_count' })
  likesCount!: number;

  @Column({ default: 0, name: 'dislikes_count' })
  dislikesCount!: number;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  @IsNotEmpty({ message: 'Comment needed to be under post.' })
  post!: Post;
}
