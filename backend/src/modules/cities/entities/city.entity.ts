import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { State } from '../../states/entities/state.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Country, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => State, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
