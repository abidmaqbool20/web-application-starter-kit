import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Status } from '../statuses/entities/status.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { UserStatus } from './enums/user-status.enum';

@Injectable()
export class UsersRepository {
  constructor(
      @InjectRepository(User)
      private readonly UserModel: Repository<User>,
      @InjectRepository(Role)
      private readonly RoleModel: Repository<Role>,
      @InjectRepository(Status)
      private readonly StatusModel: Repository<Status>,
      private readonly permissionsService: PermissionsService
  ) {}

  async create(data: CreateDto): Promise<User> {
    const user = await User.newInstanceFromDTO(data, this.RoleModel);

    // Fetch roles if role IDs exist
    if (data.roleIds && data.roleIds.length > 0) {
      user.roles = await this.RoleModel.findByIds(data.roleIds);
    }

    // Fetch additional permissions if provided
    if (data.additionalPermissionIds && data.additionalPermissionIds.length > 0) {
      user.additional_permissions = await this.permissionsService.findByIds(data.additionalPermissionIds);
    }

    // Set status if provided, otherwise default to active
    user.status = (data.status as UserStatus) || UserStatus.ACTIVE;

    const savedUser = await this.UserModel.save(user);

    // Create status record in statuses table
    await this.createStatusRecord(savedUser.id, user.status, 'User created');

    return savedUser;
  }

  private async createStatusRecord(userId: bigint, status: string, note?: string, changedBy?: bigint): Promise<void> {
    const statusRecord = this.StatusModel.create({
      statusable_type: 'User',
      statusable_id: userId,
      status: status,
      note: note,
      changed_by: changedBy,
    });
    await this.StatusModel.save(statusRecord);
  }

  // Fetch all listings
  async findAll(): Promise<User[]> {
    return this.UserModel.find({relations: ['roles', 'roles.permissions', 'additional_permissions']});
  }

  // Find Single Record
  async findOne(id: bigint): Promise<User> {
    const user = await this.UserModel.findOne({ where : {id : id}, relations: ['roles', 'roles.permissions', 'additional_permissions'] });
    if (!user) {
      throw new NotFoundException('Record not found');
    }
    return user;
  }

  // Find Single Record with Status History
  async findOneWithStatusHistory(id: bigint): Promise<User> {
    const user = await this.UserModel.findOne({ where : {id : id}, relations: ['roles', 'roles.permissions', 'additional_permissions'] });
    if (!user) {
      throw new NotFoundException('Record not found');
    }

    // Manually fetch status history for this user
    const statuses = await this.StatusModel.find({
      where: {
        statusable_type: 'User',
        statusable_id: id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    // Attach statuses to user object
    user.statuses = statuses;

    return user;
  }

  // Find by Username
  async findByUsername(username: string): Promise<User> {
    const user = await this.UserModel.findOne({ where : {email : username}, relations: ['roles', 'roles.permissions', 'additional_permissions'] });
    if (!user) {
      throw new NotFoundException('Record not found');
    }
    return user;
  }

  // Find by Username
  async findByIds(ids: String[]): Promise<User[]> {
    const record = await this.UserModel.find({
      where: { id: In(ids) },
    });
    if (!record) {
      throw new NotFoundException('Records not found');
    }
    return record;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldStatus = user.status;

    // Update basic fields
    if (userData.name) user.name = userData.name;
    if (userData.email) user.email = userData.email;
    if (userData.password) user.password = userData.password;

    // Update status if provided and different from current
    if (userData.status && userData.status !== oldStatus) {
      user.status = userData.status as UserStatus;
    }

    // Update roles if provided
    if (userData.roleIds !== undefined) {
      if (userData.roleIds.length > 0) {
        user.roles = await this.RoleModel.findByIds(userData.roleIds);
      } else {
        user.roles = [];
      }
    }

    // Update additional permissions if provided
    if (userData.additionalPermissionIds !== undefined) {
      if (userData.additionalPermissionIds.length > 0) {
        user.additional_permissions = await this.permissionsService.findByIds(userData.additionalPermissionIds);
      } else {
        user.additional_permissions = [];
      }
    }

    await this.UserModel.save(user);

    // Create status record if status changed
    if (userData.status && userData.status !== oldStatus) {
      await this.createStatusRecord(user.id, user.status, 'Status updated');
    }

    return this.findOne(id);
  }

  // Delete a record
  async remove(id: bigint): Promise<Boolean> {
    let result = false;
    const record = await this.findOne(id);
    if (record) {
      let deleted = await this.UserModel.delete(id.toString());
      result = deleted ? true : false;
    }
    return result;
  }
}
