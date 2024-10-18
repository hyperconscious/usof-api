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

  @Column({ unique: true })
  @Length(4, 20)
  login!: string;

  @Column()
  password!: string;

  @Column()
  full_name!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ default: false })
  verified!: boolean;

  @Column({ default: '' })
  avatar!: string;

  @Column({ default: 0 })
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
