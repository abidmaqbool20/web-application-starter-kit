import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MasterData } from './entities/master_data.entity';
import { CreateMasterDataDto } from './dto/create-master_data.dto';
import { UpdateMasterDataDto } from './dto/update-master_data.dto';

@Injectable()
export class MasterDataRepository {
  constructor(
    @InjectRepository(MasterData)
    private readonly masterDataRepo: Repository<MasterData>,
  ) { }

  async create(data: CreateMasterDataDto): Promise<MasterData> {
    // Auto-generate key from value if not provided
    if (!data.key && data.value) {
      data.key = this.generateKey(data.value);
    }
    const entity = this.masterDataRepo.create(data);
    return this.masterDataRepo.save(entity);
  }

  async findAll(): Promise<MasterData[]> {
    return this.masterDataRepo.find({
      order: { category: 'ASC', sortOrder: 'ASC', value: 'ASC' },
      relations: ['parent'],
    });
  }

  async findOne(id: string): Promise<MasterData> {
    const entity = await this.masterDataRepo.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!entity) throw new NotFoundException('MasterData not found');
    return entity;
  }

  async findByCategory(category: string, activeOnly = true): Promise<MasterData[]> {
    const where: any = { category };
    if (activeOnly) {
      where.isActive = true;
    }
    return this.masterDataRepo.find({
      where,
      order: { sortOrder: 'ASC', value: 'ASC' },
      relations: ['parent'],
    });
  }

  async findByParent(parentId: string, activeOnly = true): Promise<MasterData[]> {
    const where: any = { parentId };
    if (activeOnly) {
      where.isActive = true;
    }
    return this.masterDataRepo.find({
      where,
      order: { sortOrder: 'ASC', value: 'ASC' },
    });
  }

  async findRootItems(category: string, activeOnly = true): Promise<MasterData[]> {
    const where: any = { category, parentId: IsNull() };
    if (activeOnly) {
      where.isActive = true;
    }
    return this.masterDataRepo.find({
      where,
      order: { sortOrder: 'ASC', value: 'ASC' },
    });
  }

  async findByCategoryAndKey(category: string, key: string): Promise<MasterData | null> {
    return this.masterDataRepo.findOne({
      where: { category, key },
    });
  }

  async update(id: string, data: UpdateMasterDataDto): Promise<MasterData> {
    const entity = await this.findOne(id);
    Object.assign(entity, data);
    return this.masterDataRepo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.masterDataRepo.delete(id);
  }

  async bulkCreate(items: CreateMasterDataDto[]): Promise<MasterData[]> {
    const entities = items.map((item) => {
      if (!item.key && item.value) {
        item.key = this.generateKey(item.value);
      }
      return this.masterDataRepo.create(item);
    });
    return this.masterDataRepo.save(entities);
  }

  private generateKey(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  }
}
