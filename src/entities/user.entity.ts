import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity()
@Unique(['login', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(4, 20)
  login!: string;

  @Column()
  password!: string;

  @Column()
  full_name!: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  profile_picture!: string;

  @Column()
  rating!: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role!: UserRole;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 7);
  }

  public comparePassword(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}