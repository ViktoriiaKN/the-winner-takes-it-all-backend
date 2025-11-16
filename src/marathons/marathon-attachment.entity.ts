import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Marathon } from './marathon.entity';

@Entity()
export class MarathonAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Marathon, { onDelete: 'CASCADE' })
  marathon: Marathon;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  mimeType?: string;

  @CreateDateColumn()
  createdAt: Date;
}
