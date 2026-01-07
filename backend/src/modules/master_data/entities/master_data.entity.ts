import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('master_data')
@Index(['category', 'key'], { unique: true, where: 'key IS NOT NULL' })
export class MasterData {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  @Index()
  category: string; // e.g., 'employment_type', 'religion', 'caste', 'education_level'

  @Column({ nullable: true })
  key: string; // machine-readable key, e.g., 'full_time', 'hindu'

  @Column()
  value: string; // display value, e.g., 'Full Time', 'Hindu'

  @Column({ nullable: true })
  label: string; // optional alternate display label

  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  @Index()
  parentId: string; // for hierarchical data (e.g., caste -> religion)

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number; // custom ordering in dropdowns

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // extensible metadata

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Self-referencing relationship for hierarchical data
  @ManyToOne(() => MasterData, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: MasterData;
}
