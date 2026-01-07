import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn , ManyToMany, OneToMany, JoinTable, Repository} from 'typeorm';
import { CreateDto } from '../dto/create.dto';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Status } from '../../statuses/entities/status.entity';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserStatus.ACTIVE,
    comment: 'Current status of the user (active, inactive, suspended, banned)'
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
    comment: 'Type of user (system, client)'
  })
  user_type: UserType;

  @OneToMany(() => Status, (status) => status.statusable_id, {
    eager: false,
  })
  statuses: Status[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'user_additional_permissions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  additional_permissions: Permission[];

  static async newInstanceFromDTO(
    data: CreateDto,
    roleRepository: Repository<Role>
  ): Promise<User> {
    const result = new User();
    result.name = data.name;
    result.email = data.email;
    result.password = data.password;
    result.created_at = data.created_at || new Date();
    result.updated_at = new Date();

    if (data.roleIds && data.roleIds.length > 0) {
      result.roles = await roleRepository.findByIds(data.roleIds);
    } else {
      result.roles = [];
    }

    return result;
  }


}
