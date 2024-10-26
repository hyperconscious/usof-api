import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, Length } from 'class-validator';
import { Category } from './category.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

export enum PostStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @IsNotEmpty({ message: 'Author is required' })
  author!: User;

  @Column()
  @Length(5, 255, { message: 'Title must be between 5 and 255 characters' })
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  publishDate!: Date;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.inactive,
  })
  status!: PostStatus;

  @Column({ type: 'text' })
  @IsNotEmpty({ message: 'Content is required' })
  content!: string;

  @Column('simple-array', { nullable: true })
  images!: string[];

  @ManyToMany(() => Category, { eager: true, cascade: true })
  @JoinTable()
  categories!: Category[];

  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];

  @Column({ default: 0, name: 'likes_count' })
  likesCount!: number;

  @Column({ default: 0, name: 'dislikes_count' })
  dislikesCount!: number;

  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  comments!: Comment[];

  @Column({ default: 0, name: 'comments_count' })
  commentsCount!: number;
}
