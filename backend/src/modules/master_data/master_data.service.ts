import { Injectable } from '@nestjs/common';
import { MasterDataRepository } from './master_data.repository';
import { CreateMasterDataDto } from './dto/create-master_data.dto';
import { UpdateMasterDataDto } from './dto/update-master_data.dto';
import { MasterData } from './entities/master_data.entity';

@Injectable()
export class MasterDataService {
  constructor(private readonly repository: MasterDataRepository) { }

  async create(data: CreateMasterDataDto): Promise<MasterData> {
    return this.repository.create(data);
  }

  async findAll(): Promise<MasterData[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<MasterData> {
    return this.repository.findOne(id);
  }

  async findByCategory(category: string, activeOnly = true): Promise<MasterData[]> {
    return this.repository.findByCategory(category, activeOnly);
  }

  async findByParent(parentId: string, activeOnly = true): Promise<MasterData[]> {
    return this.repository.findByParent(parentId, activeOnly);
  }

  async findRootItems(category: string, activeOnly = true): Promise<MasterData[]> {
    return this.repository.findRootItems(category, activeOnly);
  }

  async findByCategoryAndKey(category: string, key: string): Promise<MasterData | null> {
    return this.repository.findByCategoryAndKey(category, key);
  }

  async update(id: string, data: UpdateMasterDataDto): Promise<MasterData> {
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    return this.repository.remove(id);
  }

  async bulkCreate(items: CreateMasterDataDto[]): Promise<MasterData[]> {
    return this.repository.bulkCreate(items);
  }
}
