import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, Length } from 'class-validator';
import { Category } from './category.entity';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

export enum PostStatus {
  active = 'active',
  inactive = 'inactive',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
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

  @ManyToMany(() => Category, { eager: true })
  @JoinTable()
  categories!: Category[];

  @Column({ default: 0 })
  likes!: number;

  @Column({ default: 0 })
  dislikes!: number;
}
