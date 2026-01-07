import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesRepository {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {}

  async create(data: CreateCountryDto): Promise<Country> {
    const country = this.countryRepo.create(data);
    return this.countryRepo.save(country);
  }

  async findAll(): Promise<Country[]> {
    return this.countryRepo.find();
  }

  async findOne(id: number): Promise<Country> {
    const country = await this.countryRepo.findOne({ where: { id } });
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }

  async update(id: number, data: UpdateCountryDto): Promise<Country> {
    await this.countryRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.countryRepo.delete(id);
  }
}
