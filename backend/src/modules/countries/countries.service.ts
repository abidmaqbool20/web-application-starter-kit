import { Injectable } from '@nestjs/common';
import { CountriesRepository } from './countries.repository';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(private readonly repository: CountriesRepository) {}

  async create(data: CreateCountryDto): Promise<Country> {
    return this.repository.create(data);
  }

  async findAll(): Promise<Country[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<Country> {
    return this.repository.findOne(id);
  }

  async update(id: number, data: UpdateCountryDto): Promise<Country> {
    return this.repository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.repository.remove(id);
  }
}
