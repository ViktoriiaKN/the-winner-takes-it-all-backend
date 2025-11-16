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
import { MarathonUser } from './marathon-user.entity';
import { MarathonReview } from './marathon-review.entity';
import { MarathonAttachment } from './marathon-attachment.entity';

export type MarathonStatus = 'announced' | 'active' | 'archived';

@Entity()
export class Marathon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  owner: User;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string; // HTML з CKEditor

  @Column({ type: 'datetime' })
  timeStart: Date;

  @Column({ type: 'datetime' })
  timeEnd: Date;

  @Column({ type: 'varchar', length: 20 })
  status: MarathonStatus;

  @OneToMany(() => MarathonUser, (mu) => mu.marathon)
  participants: MarathonUser[];

  @OneToMany(() => MarathonReview, (r) => r.marathon)
  reviews: MarathonReview[];

  @OneToMany(() => MarathonAttachment, (a) => a.marathon)
  attachments: MarathonAttachment[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
