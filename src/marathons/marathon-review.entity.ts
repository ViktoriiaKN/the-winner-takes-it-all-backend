import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Marathon } from './marathon.entity';

@Entity()
export class MarathonReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Marathon, { onDelete: 'CASCADE' })
  marathon: Marathon;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author: User;

  @Column({ type: 'int' })
  rating: number; // 1–5

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
