import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('statuses')
export class Status {

  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 50, comment: 'The model type (e.g., User, Order, etc.)' })
  statusable_type: string;

  @Column({ type: 'bigint', comment: 'The ID of the related model' })
  statusable_id: bigint;

  @Column({ type: 'varchar', length: 50, comment: 'The status value' })
  status: string;

  @Column({ type: 'text', nullable: true, comment: 'Optional note about the status change' })
  note: string;

  @Column({ type: 'bigint', nullable: true, comment: 'ID of user who changed the status' })
  changed_by: bigint;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
