import { Injectable } from '@nestjs/common';
import { StatesRepository } from './states.repository';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './entities/state.entity';

@Injectable()
export class StatesService {
  constructor(private readonly repository: StatesRepository) { }

  async create(data: CreateStateDto): Promise<State> {
    return this.repository.create(data);
  }

  async findAll(): Promise<State[]> {
    return this.repository.findAll();
  }

  async findByCountry(countryId: number): Promise<State[]> {
    return this.repository.findByCountry(countryId);
  }

  async findOne(id: number): Promise<State> {
    return this.repository.findOne(id);
  }

  async update(id: number, data: UpdateStateDto): Promise<State> {
    return this.repository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.repository.remove(id);
  }
}
