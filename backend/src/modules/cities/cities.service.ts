import { Injectable } from '@nestjs/common';
import { CitiesRepository } from './cities.repository';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(private readonly repository: CitiesRepository) { }

  async create(data: CreateCityDto): Promise<City> {
    return this.repository.create(data);
  }

  async findAll(): Promise<City[]> {
    return this.repository.findAll();
  }

  async findByState(stateId: number): Promise<City[]> {
    return this.repository.findByState(stateId);
  }

  async findByCountry(countryId: number): Promise<City[]> {
    return this.repository.findByCountry(countryId);
  }

  async findOne(id: number): Promise<City> {
    return this.repository.findOne(id);
  }

  async update(id: number, data: UpdateCityDto): Promise<City> {
    return this.repository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.repository.remove(id);
  }
}
