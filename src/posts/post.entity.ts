import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from 'src/comments/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  // rich-text/HTML з CKEditor
  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author: User;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
