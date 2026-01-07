import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { Country } from '../countries/entities/country.entity';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StatesRepository {
  constructor(
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>
  ) { }

  async create(data: CreateStateDto): Promise<State> {
    const country = await this.countryRepo.findOne({ where: { id: data.countryId } });
    if (!country) throw new NotFoundException('Country not found');
    const state = this.stateRepo.create({ ...data, country });
    return this.stateRepo.save(state);
  }

  async findAll(): Promise<State[]> {
    return this.stateRepo.find({ relations: ['country'] });
  }

  async findByCountry(countryId: number): Promise<State[]> {
    return this.stateRepo.find({
      where: { country: { id: countryId } },
      relations: ['country'],
    });
  }

  async findOne(id: number): Promise<State> {
    const state = await this.stateRepo.findOne({ where: { id }, relations: ['country'] });
    if (!state) throw new NotFoundException('State not found');
    return state;
  }

  async update(id: number, data: UpdateStateDto): Promise<State> {
    const state = await this.findOne(id);
    if (data.countryId) {
      const country = await this.countryRepo.findOne({ where: { id: data.countryId } });
      if (!country) throw new NotFoundException('Country not found');
      state.country = country;
    }
    if (data.name !== undefined) state.name = data.name;
    if (data.isActive !== undefined) state.isActive = data.isActive;
    return this.stateRepo.save(state);
  }

  async remove(id: number): Promise<void> {
    await this.stateRepo.delete(id);
  }
}
