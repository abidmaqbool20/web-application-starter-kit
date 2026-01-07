import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateDto } from '../dto/create.dto';
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string;

  @Column({ unique: true, type: 'varchar', nullable: false })
  key: string;

  @Column({ type: 'bigint', nullable: true })
  parent_id: bigint | null;

  static async newInstanceFromDTO(data: CreateDto): Promise<Permission> {
    const result = new Permission();
    result.name = data.name;
    result.key = data.key;
    result.parent_id = data.parent_id ?? null;
    return result;
  }
}
