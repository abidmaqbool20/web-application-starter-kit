import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { State } from '../states/entities/state.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesRepository {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>
  ) { }

  async create(data: CreateCityDto): Promise<City> {
    const country = await this.countryRepo.findOne({ where: { id: data.countryId } });
    if (!country) throw new NotFoundException('Country not found');
    const state = await this.stateRepo.findOne({ where: { id: data.stateId } });
    if (!state) throw new NotFoundException('State not found');
    const city = this.cityRepo.create({ ...data, country, state });
    return this.cityRepo.save(city);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepo.find({ relations: ['country', 'state'] });
  }

  async findByState(stateId: number): Promise<City[]> {
    return this.cityRepo.find({
      where: { state: { id: stateId } },
      relations: ['country', 'state'],
    });
  }

  async findByCountry(countryId: number): Promise<City[]> {
    return this.cityRepo.find({
      where: { country: { id: countryId } },
      relations: ['country', 'state'],
    });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepo.findOne({ where: { id }, relations: ['country', 'state'] });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  async update(id: number, data: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id);
    if (data.countryId) {
      const country = await this.countryRepo.findOne({ where: { id: data.countryId } });
      if (!country) throw new NotFoundException('Country not found');
      city.country = country;
    }
    if (data.stateId) {
      const state = await this.stateRepo.findOne({ where: { id: data.stateId } });
      if (!state) throw new NotFoundException('State not found');
      city.state = state;
    }
    if (data.name !== undefined) city.name = data.name;
    if (data.isActive !== undefined) city.isActive = data.isActive;
    return this.cityRepo.save(city);
  }

  async remove(id: number): Promise<void> {
    await this.cityRepo.delete(id);
  }
}
