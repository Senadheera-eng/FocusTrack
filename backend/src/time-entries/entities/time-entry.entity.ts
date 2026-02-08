import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn
} from 'typeorm';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  taskId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date | null;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;
}