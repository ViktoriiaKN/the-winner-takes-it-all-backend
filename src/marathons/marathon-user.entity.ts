import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Marathon } from './marathon.entity';

export type MarathonUserRole = 'mentor' | 'student';

@Entity()
export class MarathonUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Marathon, { onDelete: 'CASCADE' })
  marathon: Marathon;

  @Column({ type: 'varchar', length: 20 })
  role: MarathonUserRole;
}
